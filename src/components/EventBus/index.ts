import { DependencyList, useEffect } from 'react';
import EventEmitter from './components/EventEmitter';
import {
  EmitActionConstant,
  EmitEventConstant,
} from './components/EmitterConstant';
// import { EventEmitter } from 'react-native'

const _emitter = new EventEmitter();

export interface EmitterTypes {
  [EmitActionConstant.GET_LIST_REQUEST]: { page: number };
  [EmitActionConstant.GET_LIST_EXPENSE]: { page: number };
}

export const myEmitter = {
  addListener<K extends keyof EmitterTypes>(
    key: K,
    listener: (payload: EmitterTypes[K]) => void,
  ) {
    return _emitter.on(key, listener);
  },
  emit<K extends keyof EmitterTypes>(key: K, payload: EmitterTypes[K]) {
    // if (__DEV__) console.debug('[EMITTER]', key, payload) // eslint-disable-line no-console
    _emitter.emit(key, payload);
  },
};

export function useEmitter<K extends keyof EmitterTypes>(
  key: K | undefined,
  callback: (payload: EmitterTypes[K]) => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    if (!(key && callback)) return;

    const listener = myEmitter.addListener(key, callback);
    return () => listener.off(key, callback);
  }, [key, ...deps]);

  return myEmitter;
}
