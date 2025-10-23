import React, { createContext, useContext, useState } from 'react';
import { MyAlertProps } from '../dialog/MyAlert.types';
import MyAlert from '../dialog/MyAlert';

interface AlertContextProps {
  showAlert: (props: MyAlertProps) => void;
  hideAlert: () => void;
}

const MyAlertContext = createContext<AlertContextProps>({
  showAlert: () => {},
  hideAlert: () => {},
});

export const useMyAlert = () => useContext(MyAlertContext);

export const MyAlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState<MyAlertProps>({
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (props: MyAlertProps) => {
    setAlertProps(props);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  return (
    <MyAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <MyAlert visible={alertVisible} onClose={hideAlert} {...alertProps} />
    </MyAlertContext.Provider>
  );
};
