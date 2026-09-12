// bt:ec52ad88d4b0903b
import React, { useEffect } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useAlmaraiFonts,
  Almarai_400Regular,
  Almarai_700Bold,
  Almarai_800ExtraBold,
} from '@expo-google-fonts/almarai';
import {
  useFonts as useFigtreeFonts,
  Figtree_400Regular,
  Figtree_700Bold,
  Figtree_800ExtraBold,
} from '@expo-google-fonts/figtree';
import { brandColors } from './src/brand/theme';
import { AuthProvider } from './src/firebase/AuthContext';
import { FavoritesProvider } from './src/customer/FavoritesContext';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {});

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // ملاحظة: فرض RTL على React Native يحتاج إعادة تشغيل كاملة للتطبيق ليأخذ مفعوله
  // بالكامل على بعض الأجهزة. أول تشغيل بعد التثبيت قد يحتاج إعادة فتح يدوية.
}

export default function App() {
  const [almaraiLoaded] = useAlmaraiFonts({ Almarai_400Regular, Almarai_700Bold, Almarai_800ExtraBold });
  const [figtreeLoaded] = useFigtreeFonts({ Figtree_400Regular, Figtree_700Bold, Figtree_800ExtraBold });

  const ready = almaraiLoaded && figtreeLoaded;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return <View style={styles.loading} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <View style={styles.app}>
            <StatusBar style="dark" />
            <RootNavigator />
          </View>
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: brandColors.bg },
  loading: { flex: 1, backgroundColor: brandColors.bg },
});
