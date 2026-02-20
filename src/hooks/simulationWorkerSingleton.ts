/**
 * Shared singleton Web Worker for loan simulation calculations.
 *
 * Manages a single Worker instance shared across all hooks that need simulation
 * computations. The worker is created lazily on first message and lives for the
 * duration of the app. A listeners map enables multiplexed message routing.
 *
 * This module MUST live in src/hooks/ so the relative path to the worker file
 * resolves correctly at build time (webpack statically analyzes the URL pattern).
 */

import type {
  WorkerMessage,
  WorkerPayload,
  WorkerResponse,
  WorkerResultType,
} from "@/workers/simulation.worker";

type Listener = (result: WorkerResultType) => void;

let worker: Worker | null = null;
let nextRequestId = 0;
const listeners = new Map<number, Listener>();

function createWorker(): Worker {
  const w = new Worker(
    new URL("../workers/simulation.worker.ts", import.meta.url),
  );

  w.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const { id, result } = event.data;
    const listener = listeners.get(id);
    if (listener) {
      listeners.delete(id);
      listener(result);
    }
  };

  w.onerror = (event: ErrorEvent) => {
    console.error("[SimulationWorker] Worker error:", event.message);
  };

  return w;
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
  listeners.set(id, onResponse);

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
