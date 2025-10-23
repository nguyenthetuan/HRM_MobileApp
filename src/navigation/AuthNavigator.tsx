// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '@/screens/Login';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="Login" component={Login} />
      {/* Có thể thêm Register, ForgotPassword ở đây nếu cần */}
    </Stack.Navigator>
  );
}
