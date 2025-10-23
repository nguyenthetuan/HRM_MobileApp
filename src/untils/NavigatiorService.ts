import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { createRef } from 'react';

export const navigationRef = createNavigationContainerRef();
export const routersRef = createRef<any>();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function replace(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      routes: [
        {
          name,
          params,
        },
      ],
    });
  }
}

export function pop(count = 1) {
  if (navigationRef.isReady() && (routersRef.current?.length ?? 0) > count) {
    const popAction = StackActions.pop(count || 1);
    navigationRef.dispatch(popAction);
  }
}

export function push(...args) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(...args));
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export const getCurrentScreen = () => {
  const routes = routersRef.current;
  if (!routes) return null;
  return routes[routes.length - 1];
};

export const getPreviousScreen = () => {
  const routes = routersRef.current;
  if (!routes) return null;
  return routes[routes.length - 2];
};

export const getGrandFatherScreen = () => {
  const routes = routersRef.current;
  if (!routes) return null;
  return routes[routes.length - 3];
};
