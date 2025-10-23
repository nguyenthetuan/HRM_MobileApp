// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import { logoutSlice } from '@/redux/slices/authSlices';
import { useDispatch } from 'react-redux';
export const AuthContext = createContext(null);

const storage = new MMKV();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<any>();

  const login = async (token: string) => {
    setUserToken(token);
    storage.set('userToken', token);
  };

  const logout = async () => {
    setUserToken(null);
    storage.delete('userToken');
    dispatch(logoutSlice());
  };

  const checkLogin = () => {
    const token = storage.getString('userToken');
    setUserToken(token ?? null);
    setIsLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
