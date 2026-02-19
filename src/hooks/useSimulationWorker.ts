import { useState, useEffect, useTransition } from "react";
import {
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
 * Uses a shared singleton worker (created lazily on first message).
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

  // Send message when payload changes
  useEffect(() => {
    if (!payload) {
      return;
    }

    let cancelled = false;

    const id = postWorkerMessage(payload, (workerResult) => {
      if (!cancelled) {
        startTransition(() => {
          setResult(workerResult as ResultFor<P>);
        });
      }
    });

    return () => {
      cancelled = true;
      cancelWorkerMessage(id);
    };
  }, [payload]);

  return result;
}
