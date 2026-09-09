// bt:ec52ad88d4b0903b
import React, { useEffect } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useSansArabicFonts,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { useFonts as useMonoFonts, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { colors } from './src/theme';
import { DataProvider } from './src/data/DataContext';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {});

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // ملاحظة: فرض RTL على React Native يحتاج إعادة تشغيل كاملة للتطبيق ليأخذ مفعوله
  // بالكامل على بعض الأجهزة. أول تشغيل بعد التثبيت قد يحتاج إعادة فتح يدوية.
}

export default function App() {
  const [sansLoaded] = useSansArabicFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });
  const [monoLoaded] = useMonoFonts({ IBMPlexMono_600SemiBold });

  const ready = sansLoaded && monoLoaded;

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
      <DataProvider>
        <View style={styles.app}>
          <StatusBar style="dark" />
          <RootNavigator />
        </View>
      </DataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, backgroundColor: colors.bg },
});
