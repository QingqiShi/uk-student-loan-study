/**
 * Shared singleton Web Worker for loan simulation calculations.
 *
 * Manages a single Worker instance shared across all hooks that need simulation
 * computations. Uses ref-counting for lifecycle management and a listeners map
 * for multiplexed message routing.
 *
 * This module MUST live in src/hooks/ so the relative path to the worker file
 * resolves correctly at build time (webpack statically analyzes the URL pattern).
 */

import type {
  WorkerMessage,
  WorkerResponse,
  WorkerResultType,
} from "@/workers/simulation.worker";

type Listener = (result: WorkerResultType) => void;

let worker: Worker | null = null;
let refCount = 0;
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
 * Acquire a reference to the shared worker. Call releaseWorker() on cleanup.
 * The worker is created lazily on first acquisition.
 */
export function acquireWorker(): void {
  refCount++;
  if (!worker) {
    worker = createWorker();
  }
}

/**
 * Release a reference to the shared worker. When the last consumer releases,
 * the worker is terminated to free resources.
 */
export function releaseWorker(): void {
  refCount--;
  if (refCount <= 0) {
    worker?.terminate();
    worker = null;
    refCount = 0;
    listeners.clear();
  }
}

/**
 * Send a message to the shared worker and register a one-shot listener
 * for the response. Returns the request ID for cancellation.
 */
export function postWorkerMessage(
  payload: WorkerMessage["payload"],
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
 * Cancel a pending request by removing its listener. The worker will still
 * process the message, but the response will be silently discarded.
 */
export function cancelWorkerMessage(id: number): void {
  listeners.delete(id);
}
