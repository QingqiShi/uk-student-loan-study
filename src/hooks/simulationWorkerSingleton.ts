/**
 * Shared singleton Web Worker for loan simulation calculations.
 *
 * Manages a single Worker instance shared across all hooks that need simulation
 * computations. The worker is created lazily on first message and lives for the
 * duration of the app. A listeners map enables multiplexed message routing.
 *
 * If the worker fails, this module replaces it one time and sends the pending
 * requests again. If the replacement also fails, all requests after that run
 * on the main thread.
 *
 * This module MUST live in src/hooks/ so the relative path to the worker file
 * resolves correctly at build time (webpack statically analyses the URL pattern).
 */

import { captureException } from "@/lib/posthog";
import type {
  WorkerMessage,
  WorkerPayload,
  WorkerResponse,
  WorkerResultType,
} from "@/workers/simulation.worker";

type Listener = (result: WorkerResultType) => void;
type Simulate = (payload: WorkerPayload) => WorkerResultType;

interface PendingRequest {
  payload: WorkerPayload;
  onResponse: Listener;
}

let worker: Worker | null = null;
let nextRequestId = 0;
const listeners = new Map<number, PendingRequest>();

let workerRetried = false;
let unreportedWorkerError: Error | null = null;
let mainThreadSimulate: Promise<Simulate | null> | null = null;

function createWorker(): Worker {
  const w = new Worker(
    new URL("../workers/simulation.worker.ts", import.meta.url),
  );

  w.onmessage = (event: MessageEvent<WorkerResponse>) => {
    if (unreportedWorkerError) {
      captureException(unreportedWorkerError, { retrySucceeded: true });
      unreportedWorkerError = null;
    }

    const { id, result } = event.data;
    const request = listeners.get(id);
    if (request) {
      listeners.delete(id);
      request.onResponse(result);
    }
  };

  w.onerror = (event: ErrorEvent) => {
    // Cancel the event. If not, the browser also sends the error to the page,
    // and PostHog records it as an unhandled exception.
    event.preventDefault();
    console.error("[SimulationWorker] Worker error:", event.message);
    w.terminate();
    worker = null;

    const error = new Error(event.message || "Simulation worker error");
    if (workerRetried) {
      captureException(unreportedWorkerError ?? error, {
        retrySucceeded: false,
      });
      unreportedWorkerError = null;
      runPendingOnMainThread();
      return;
    }

    workerRetried = true;
    unreportedWorkerError = error;
    worker = createWorker();
    for (const [id, { payload }] of listeners) {
      worker.postMessage({ id, payload } satisfies WorkerMessage);
    }
  };

  return w;
}

function loadMainThreadSimulate(): Promise<Simulate | null> {
  return import("@/workers/runSimulation").then(
    ({ runSimulation }) => runSimulation,
    (error: unknown) => {
      captureException(error);
      return null;
    },
  );
}

function runPendingOnMainThread(): void {
  mainThreadSimulate ??= loadMainThreadSimulate();
  void mainThreadSimulate.then((simulate) => {
    if (!simulate) return;
    for (const [id, { payload, onResponse }] of listeners) {
      listeners.delete(id);
      try {
        onResponse(simulate(payload));
      } catch (error) {
        captureException(error);
      }
    }
  });
}

/**
 * Send a message to the shared worker and register a one-shot listener
 * for the response. Returns the request ID for cancellation.
 */
export function postWorkerMessage(
  payload: WorkerPayload,
  onResponse: Listener,
): number {
  const id = ++nextRequestId;
  listeners.set(id, { payload, onResponse });

  if (mainThreadSimulate !== null) {
    runPendingOnMainThread();
    return id;
  }

  if (!worker) {
    worker = createWorker();
  }

  worker.postMessage({ id, payload } satisfies WorkerMessage);
  return id;
}

/**
 * Cancel a pending request. Removes the listener and notifies the worker
 * so it can skip the computation if it hasn't started yet.
 */
export function cancelWorkerMessage(id: number): void {
  listeners.delete(id);
  if (worker) {
    worker.postMessage({ id, cancel: true } satisfies WorkerMessage);
  }
}
