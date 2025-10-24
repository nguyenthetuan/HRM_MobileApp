import 'react-native-gesture-handler';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme';
import { store, persistor } from '@/redux/store';
import i18n from '@/translations';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './navigation/AuthContext';
import { MyAlertProvider } from './components/AlertContext';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StatusBar } from 'react-native';
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: { retry: false },
  },
});

export const storage = new MMKV();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <I18nextProvider i18n={i18n}>
                  <AuthProvider>
                    <MyAlertProvider>
                      <ThemeProvider storage={storage}>
                        <StatusBar translucent backgroundColor="transparent" />
                        <RootNavigator />
                        <Toast />
                      </ThemeProvider>
                    </MyAlertProvider>
                  </AuthProvider>
                </I18nextProvider>
              </PersistGate>
            </Provider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
