import type { RootStackParamList } from '@/navigation/types';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';
import { Account, Home, TimeKeeping } from '@/screens';
import BottomTabNavigator from './BottomTabNavigator';

import Employeers from '@/screens/Company/Employeers';
import LeaveList from '@/screens/Company/LeaveList';
import EmployeerDetail from '@/screens/Company/Employeers/EmployeerDetail';
import Setting from '@/screens/Account/Setting';
import MyLeaveList from '@/screens/Company/MyLeaveList';
import CreateHoliday from '@/screens/Company/CreateHoliday';
import PersonInfor from '@/screens/Account/PersonInfor';
import { useEffect } from 'react';
import { useCommonData } from '@/hooks/CommonData';
import ExpenseList from '@/screens/Company/ExpenseList';
import MyExpenseList from '@/screens/Company/MyExpenseList';
import CreateExpense from '@/screens/Company/CreateExpense';
import Notification from '@/screens/Notificaiton';
import { useSelector } from 'react-redux';
const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { variant } = useTheme();
  const user = useSelector((state: any) => state.user);
  const {
    getDeparmentPaging,
    getPositionPaging,
    getShiftPaging,
    getEmployeers,
  } = useCommonData();

  useEffect(() => {
    getDeparmentPaging();
    getPositionPaging();
    getShiftPaging();
  }, []);

  useEffect(() => {
    getEmployeers();
  }, [user.DepartmentId]);

  return (
    <SafeAreaProvider>
      <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
        <Stack.Screen component={BottomTabNavigator} name={Paths.Main} />
        <Stack.Screen component={Home} name={Paths.Home} />
        <Stack.Screen component={TimeKeeping} name={Paths.TimeKeeping} />
        <Stack.Screen component={Account} name={Paths.Account} />
        <Stack.Screen component={Employeers} name={Paths.Employeer} />
        <Stack.Screen component={LeaveList} name={Paths.LeaveList} />
        <Stack.Screen
          component={EmployeerDetail}
          name={Paths.EmployeerDetail}
        />
        <Stack.Screen component={Setting} name={Paths.Setting} />
        <Stack.Screen component={MyLeaveList} name={Paths.MyLeaveList} />
        <Stack.Screen component={CreateHoliday} name={Paths.CreateHoliday} />
        <Stack.Screen component={PersonInfor} name={Paths.PersonInfo} />
        <Stack.Screen component={ExpenseList} name={Paths.ExpenseList} />
        <Stack.Screen component={MyExpenseList} name={Paths.MyExpenseList} />
        <Stack.Screen component={CreateExpense} name={Paths.CreateExpense} />
        <Stack.Screen component={Notification} name={Paths.Notification} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
