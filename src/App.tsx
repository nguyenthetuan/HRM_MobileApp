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
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <I18nextProvider i18n={i18n}>
                <AuthProvider>
                  <MyAlertProvider>
                    <ThemeProvider storage={storage}>
                      <KeyboardAwareScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        enableOnAndroid={false}
                        keyboardShouldPersistTaps="handled"
                        extraScrollHeight={0} // hoặc nhỏ hơn, ví dụ 10
                      >
                        <RootNavigator />
                      </KeyboardAwareScrollView>
                      <Toast />
                    </ThemeProvider>
                  </MyAlertProvider>
                </AuthProvider>
              </I18nextProvider>
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
