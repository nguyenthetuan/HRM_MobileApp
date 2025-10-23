import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TimeKeeping, Home, Account } from '@/screens';
import { Paths } from './paths';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Company } from '@/screens/Company';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Notification from '@/screens/Notificaiton';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === Paths.Home) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === Paths.TimeKeeping) {
            iconName = focused ? 'flask' : 'flask-outline';
          }

          return route.name === Paths.TimeKeeping ? (
            <Feather name="briefcase" size={25} color={color} />
          ) : route.name === Paths.Account ? (
            <Feather name="users" size={25} color={color} />
          ) : route.name === Paths.Company ? (
            <FontAwesome6 name="building" size={25} color={color} />
          ) : route.name === Paths.Notification ? (
            <MaterialIcons
              name="notifications-active"
              color={color}
              size={size}
            />
          ) : (
            <Ionicons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60 + insets.bottom, // tăng chiều cao theo safe area
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5, // padding dynamic
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen name={Paths.Home} component={Home} />
      <Tab.Screen name={Paths.TimeKeeping} component={TimeKeeping} />
      <Tab.Screen name={Paths.Company} component={Company} />
      <Tab.Screen name={Paths.Notification} component={Notification} />
      <Tab.Screen name={Paths.Account} component={Account} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
