import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { useAuth } from '../../firebase/AuthContext';
import { signOutUser } from '../../firebase/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminHome'>;

export function AdminHomeScreen({ navigation }: Props) {
  const { profile } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
    navigation.replace('Main');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>
          menu<Text style={{ color: brandColors.accent }}>.</Text>
        </Text>
        <Pressable onPress={handleSignOut} style={styles.logoutChip}>
          <Text style={styles.logoutText}>خروج</Text>
        </Pressable>
      </View>
      <Text style={styles.email}>{profile?.email}</Text>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          تسجيل دخول الأدمن يشتغل الآن على قاعدة بيانات حقيقية. شاشة مراجعة طلبات المطاعم
          (اعتماد/رفض/إيقاف) هي الخطوة الجاية.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: brandColors.adminBg, padding: 20, paddingTop: 58 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { fontFamily: brandFont.enExtraBold, fontSize: 26, color: '#fff' },
  logoutChip: { backgroundColor: brandColors.white12, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  logoutText: { fontFamily: brandFont.arBold, fontSize: 11.5, color: '#fff' },
  email: { fontFamily: brandFont.enRegular, fontSize: 12, color: brandColors.white55, marginTop: 6, writingDirection: 'ltr' },
  noteBox: { backgroundColor: brandColors.white08, borderRadius: 18, padding: 15, marginTop: 24 },
  noteText: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.white60, lineHeight: 20 },
});
