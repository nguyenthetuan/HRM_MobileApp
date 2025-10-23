import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppBackground(callback: () => void) {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // khi app đang active và chuyển sang background hoặc inactive
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        callback && callback();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);
}
