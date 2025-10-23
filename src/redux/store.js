import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { MMKV } from 'react-native-mmkv';
import userReducer from './slices/UserSlices';
import commonDataReducer from './slices/CommonDataSlice';
import authReducer from './slices/authSlices';
import locationDevice from './slices/checkLocationDevice';
// Tạo instance MMKV
const mmkvStorage = new MMKV();

// Adapter cho redux-persist
const reduxMMKVStorage = {
  setItem: (key, value) => {
    mmkvStorage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = mmkvStorage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    mmkvStorage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxMMKVStorage,
  version: 1,
  blacklist: [], // không lưu
  whitelist: ['user'], // chỉ lưu
};

const appReducer = combineReducers({
  user: userReducer,
  common: commonDataReducer,
  auth: authReducer,
  locationDevice: locationDevice,
});
// reset khi logout
const rootReducer = (state, action) => {
  if (action.type === 'auth/logoutSlice') {
    state = undefined;
  }
  return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
