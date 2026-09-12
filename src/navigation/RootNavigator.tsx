// bt:ec52ad88d4b0903b
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from './types';
import { colors, fontFamily } from '../theme';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { FavoritesScreen } from '../screens/customer/FavoritesScreen';
import { RestaurantScreen } from '../screens/customer/RestaurantScreen';
import { OwnerLoginScreen } from '../screens/owner/OwnerLoginScreen';
import { DashboardScreen } from '../screens/owner/DashboardScreen';
import { MerchantAuthScreen } from '../screens/merchant/MerchantAuthScreen';
import { OwnerHomeScreen } from '../screens/merchant/OwnerHomeScreen';
import { AdminLoginScreen } from '../screens/admin/AdminLoginScreen';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

type MainProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

function TopBar({ onOwnerPress, onAdminPress }: { onOwnerPress: () => void; onAdminPress: () => void }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <Text style={styles.brand}>منيو</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>نموذج أولي</Text>
        </View>
      </View>
      <View style={styles.topLinks}>
        <Pressable onPress={onAdminPress} hitSlop={8}>
          <Text style={styles.adminLinkText}>دخول الإدارة</Text>
        </Pressable>
        <Pressable onPress={onOwnerPress} style={styles.ownerLink}>
          <Text style={styles.ownerLinkText}>لوحة صاحب المطعم</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MainTabs({ navigation }: MainProps) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar
        onOwnerPress={() => navigation.navigate('MerchantAuth')}
        onAdminPress={() => navigation.navigate('AdminLogin')}
      />
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.inkFaint,
          tabBarLabelStyle: { fontFamily: fontFamily.arabic, fontSize: 11 },
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
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
          name="Favorites"
          component={FavoritesScreen}
          options={{
            title: 'المفضلة',
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
          }}
        />
      </Tabs.Navigator>
    </View>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true, headerBackTitle: '' }}>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="Restaurant"
          component={RestaurantScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="OwnerLogin"
          component={OwnerLoginScreen}
          options={{ title: 'لوحة صاحب المطعم' }}
        />
        <Stack.Screen
          name="OwnerDashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MerchantAuth" component={MerchantAuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: colors.bg,
  },
  brandRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  brand: { fontFamily: fontFamily.arabicBold, fontSize: 21, color: colors.ink },
  tag: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  tagText: { fontFamily: fontFamily.arabic, fontSize: 10.5, color: colors.inkSoft },
  topLinks: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adminLinkText: { fontFamily: fontFamily.arabic, fontSize: 11.5, color: colors.inkFaint },
  ownerLink: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  ownerLinkText: { fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkSoft },
});
