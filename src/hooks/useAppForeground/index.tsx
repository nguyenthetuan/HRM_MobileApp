import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppForeground(callback: () => void) {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const lastActiveTime = useRef<number>(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const now = Date.now();

        // chống gọi liên tiếp
        if (now - lastActiveTime.current > 2000 && callback) {
          lastActiveTime.current = now;
          callback();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);
}
