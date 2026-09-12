import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Welcome'), 2000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <Pressable style={styles.screen} onPress={() => navigation.replace('Welcome')}>
      <View style={styles.decorA} />
      <View style={styles.decorB} />
      <Mascot variant="default" size={140} />
      <Text style={styles.wordmark}>
        menu<Text style={{ color: brandColors.accent }}>.</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', gap: 22, overflow: 'hidden' },
  decorA: { position: 'absolute', top: -110, right: -80, width: 260, height: 260, borderRadius: 999, backgroundColor: brandColors.accent100 },
  decorB: { position: 'absolute', bottom: -90, left: -70, width: 200, height: 200, borderRadius: 999, backgroundColor: brandColors.sage100 },
  wordmark: { fontFamily: brandFont.enExtraBold, fontSize: 26, color: brandColors.text, writingDirection: 'ltr' },
});
