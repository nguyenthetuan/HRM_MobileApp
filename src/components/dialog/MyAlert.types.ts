// MyAlert.types.ts
export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'cancel' | 'default' | 'destructive';
};

export interface MyAlertProps {
  title?: string;
  message: string;
  buttons?: AlertButton[];
  businessId?: string;
}
