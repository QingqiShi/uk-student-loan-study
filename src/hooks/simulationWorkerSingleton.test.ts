import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runSimulation } from "@/workers/runSimulation";
import type {
  WorkerMessage,
  WorkerPayload,
  WorkerResponse,
} from "@/workers/simulation.worker";

const mocks = vi.hoisted(() => ({ captureException: vi.fn() }));

vi.mock("@/lib/posthog", () => ({ captureException: mocks.captureException }));

const workers: FakeWorker[] = [];

class FakeWorker {
  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  readonly messages: WorkerMessage[] = [];
  terminated = false;

  constructor() {
    workers.push(this);
  }

  postMessage(message: WorkerMessage) {
    this.messages.push(message);
  }

  terminate() {
    this.terminated = true;
  }

  failToLoad(): ErrorEvent {
    const event = new ErrorEvent("error", {
      message: "NetworkError: Load failed",
      cancelable: true,
    });
    this.onerror?.(event);
    return event;
  }

  respond(response: WorkerResponse) {
    this.onmessage?.(new MessageEvent("message", { data: response }));
  }
}

const payload: WorkerPayload = {
  type: "DETAIL_SERIES",
  loans: [{ planType: "PLAN_2", balance: 50_000 }],
  annualSalary: 40_000,
  salaryGrowthRate: 0.02,
  thresholdGrowthRate: 0.02,
  rpiRate: 3.2,
  boeBaseRate: 4,
};

function loadSingleton() {
  return import("./simulationWorkerSingleton");
}

describe("simulationWorkerSingleton", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("Worker", FakeWorker);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    workers.length = 0;
    mocks.captureException.mockClear();
    vi.doUnmock("@/workers/runSimulation");
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("handles a worker that fails to load and resends pending requests to a new worker", async () => {
    const { postWorkerMessage } = await loadSingleton();
    const onResponse = vi.fn();

    const id = postWorkerMessage(payload, onResponse);
    const event = workers[0].failToLoad();

    expect(event.defaultPrevented).toBe(true);
    expect(workers[0].terminated).toBe(true);
    expect(workers).toHaveLength(2);
    expect(workers[1].messages).toEqual([{ id, payload }]);

    const result = runSimulation(payload);
    workers[1].respond({ id, result });

    expect(onResponse).toHaveBeenCalledExactlyOnceWith(result);
    expect(mocks.captureException).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ message: "NetworkError: Load failed" }),
      { retrySucceeded: true },
    );
  });

  it("runs pending simulations on the main thread when the new worker also fails", async () => {
    const { postWorkerMessage } = await loadSingleton();
    const onFirstResponse = vi.fn();
    const onSecondResponse = vi.fn();

    postWorkerMessage(payload, onFirstResponse);
    workers[0].failToLoad();
    const event = workers[1].failToLoad();

    expect(event.defaultPrevented).toBe(true);
    expect(workers[1].terminated).toBe(true);
    await vi.waitFor(() => {
      expect(onFirstResponse).toHaveBeenCalledExactlyOnceWith(
        runSimulation(payload),
      );
    });
    expect(mocks.captureException).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ message: "NetworkError: Load failed" }),
      { retrySucceeded: false },
    );

    postWorkerMessage(payload, onSecondResponse);
    await vi.waitFor(() => {
      expect(onSecondResponse).toHaveBeenCalledExactlyOnceWith(
        runSimulation(payload),
      );
    });
    expect(workers).toHaveLength(2);
  });

  it("reports a main-thread simulation that cannot load", async () => {
    const importError = new Error("Failed to load chunk");
    vi.doMock("@/workers/runSimulation", () => {
      throw importError;
    });
    const { postWorkerMessage } = await loadSingleton();
    const onResponse = vi.fn();

    postWorkerMessage(payload, onResponse);
    workers[0].failToLoad();
    workers[1].failToLoad();

    await vi.waitFor(() => {
      expect(mocks.captureException).toHaveBeenCalledTimes(2);
    });
    expect(mocks.captureException).toHaveBeenLastCalledWith(
      expect.objectContaining({ cause: importError }),
    );
    expect(onResponse).not.toHaveBeenCalled();
  });

  it("keeps running main-thread simulations after one of them throws", async () => {
    const simulationError = new Error("Cannot read properties of undefined");
    const insightPayload: WorkerPayload = {
      type: "INSIGHT",
      salary: 40_000,
      loans: [],
      salaryGrowthRate: 0.02,
      thresholdGrowthRate: 0.02,
      rpiRate: 3.2,
      boeBaseRate: 4,
    };
    vi.doMock("@/workers/runSimulation", () => ({
      runSimulation: (request: WorkerPayload) => {
        if (request.type === "INSIGHT") throw simulationError;
        return runSimulation(request);
      },
    }));
    const { postWorkerMessage } = await loadSingleton();
    const onInsightResponse = vi.fn();
    const onDetailResponse = vi.fn();

    postWorkerMessage(insightPayload, onInsightResponse);
    postWorkerMessage(payload, onDetailResponse);
    workers[0].failToLoad();
    workers[1].failToLoad();

    await vi.waitFor(() => {
      expect(onDetailResponse).toHaveBeenCalledExactlyOnceWith(
        runSimulation(payload),
      );
    });
    expect(onInsightResponse).not.toHaveBeenCalled();
    expect(mocks.captureException).toHaveBeenLastCalledWith(simulationError);
  });
});
