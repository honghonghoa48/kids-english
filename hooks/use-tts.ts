import * as Speech from 'expo-speech';
import { useCallback } from 'react';

export function useTTS() {
  const speak = useCallback((text: string, opts?: { rate?: number; pitch?: number }) => {
    try {
      Speech.stop();
      Speech.speak(text, {
        language: 'en-US',
        rate: opts?.rate ?? 0.85,
        pitch: opts?.pitch ?? 1.1,
      });
    } catch {
      // silent fallback
    }
  }, []);

  const stop = useCallback(() => {
    try {
      Speech.stop();
    } catch {
      // ignore
    }
  }, []);

  return { speak, stop };
}
