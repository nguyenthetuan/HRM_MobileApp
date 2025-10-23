import type { Paths } from '@/navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.TimeKeeping]: undefined;
  [Paths.Home]: undefined;
  [Paths.Main]: undefined;
  [Paths.Account]: undefined;
  [Paths.Employeer]: undefined;
  [Paths.LeaveList]: undefined;
  [Paths.EmployeerDetail]: undefined;
  [Paths.Setting]: undefined;
  [Paths.MyLeaveList]: undefined;
  [Paths.CreateHoliday]: undefined;
  [Paths.PersonInfo]: undefined;
  [Paths.ExpenseList]: undefined;
  [Paths.MyExpenseList]: undefined;
  [Paths.CreateExpense]: undefined;
  [Paths.Notification]: undefined;
};
