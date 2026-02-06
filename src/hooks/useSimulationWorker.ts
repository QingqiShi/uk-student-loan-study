import { useState, useEffect, useRef, useTransition } from "react";
import {
  acquireWorker,
  releaseWorker,
  postWorkerMessage,
  cancelWorkerMessage,
} from "./simulationWorkerSingleton";
import type {
  WorkerPayload,
  WorkerResultType,
} from "@/workers/simulation.worker";

/**
 * Maps a payload type to its corresponding result type via the shared
 * `type` discriminant on both WorkerPayload and WorkerResultType unions.
 */
type ResultFor<P extends WorkerPayload> = Extract<
  WorkerResultType,
  { type: P["type"] }
>;

/**
 * Hook for communicating with the simulation Web Worker.
 *
 * Uses a shared singleton worker (acquired on mount, released on unmount).
 * Handles request/response lifecycle and ignores stale responses.
 *
 * Two-pronged INP optimization:
 * 1. Web Worker: Simulations run off the main thread
 * 2. useTransition: Result state updates are wrapped in startTransition,
 *    marking chart re-renders as non-urgent so React can prioritize
 *    user interactions (like slider drags) over rendering
 *
 * @param payload - The payload to send to the worker (changes trigger new computation)
 * @returns The computation result, or null while pending
 */
export function useSimulationWorker<P extends WorkerPayload>(
  payload: P | null,
): ResultFor<P> | null {
  const [result, setResult] = useState<ResultFor<P> | null>(null);
  const [, startTransition] = useTransition();
  const activeRequestRef = useRef<number | null>(null);

  // Acquire/release shared worker on mount/unmount
  useEffect(() => {
    acquireWorker();
    return () => {
      releaseWorker();
    };
  }, []);

  // Send message when payload changes
  useEffect(() => {
    if (!payload) {
      return;
    }

    // Cancel previous in-flight request
    if (activeRequestRef.current !== null) {
      cancelWorkerMessage(activeRequestRef.current);
    }

    const id = postWorkerMessage(payload, (workerResult) => {
      if (activeRequestRef.current === id) {
        startTransition(() => {
          setResult(workerResult as ResultFor<P>);
        });
        activeRequestRef.current = null;
      }
    });

    activeRequestRef.current = id;

    return () => {
      cancelWorkerMessage(id);
      if (activeRequestRef.current === id) {
        activeRequestRef.current = null;
      }
    };
  }, [payload]);

  return result;
}
