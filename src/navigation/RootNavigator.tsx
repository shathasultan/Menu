import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList, RootStackParamList } from './types';
import { brandColors, brandFont } from '../brand/theme';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { SearchScreen } from '../screens/customer/SearchScreen';
import { FavoritesScreen } from '../screens/customer/FavoritesScreen';
import { VenueDetailScreen } from '../screens/customer/VenueDetailScreen';
import { MerchantAuthScreen } from '../screens/merchant/MerchantAuthScreen';
import { OwnerDashboardScreen } from '../screens/merchant/OwnerDashboardScreen';
import { AdminLoginScreen } from '../screens/admin/AdminLoginScreen';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { SplashScreen } from '../screens/brand/SplashScreen';
import { WelcomeScreen } from '../screens/brand/WelcomeScreen';
import { RoleScreen } from '../screens/brand/RoleScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: brandColors.sage700,
        tabBarInactiveTintColor: brandColors.ink35,
        tabBarLabelStyle: { fontFamily: brandFont.arBold, fontSize: 10.5 },
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: brandColors.border09 },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'البحث',
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'المفضلة',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: true, headerBackTitle: '' }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Role" component={RoleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="VenueDetail" component={VenueDetailScreen} options={{ title: '' }} />
        <Stack.Screen name="MerchantAuth" component={MerchantAuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OwnerHome" component={OwnerDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
