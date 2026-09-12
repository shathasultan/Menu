import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont, brandShadow } from '../../brand/theme';
import { useAuth } from '../../firebase/AuthContext';
import { signOutUser } from '../../firebase/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'OwnerHome'>;

export function OwnerHomeScreen({ navigation }: Props) {
  const { profile, venue, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={brandColors.sage} />
      </View>
    );
  }

  const status = venue?.status ?? 'pending';
  const statusCopy =
    status === 'approved'
      ? { title: 'متجرك منشور للعملاء', note: 'تصل تعديلات الأسعار والتوفّر إلى العملاء لحظيًا.' }
      : status === 'rejected'
        ? { title: 'تم رفض طلبك', note: 'راجعي بيانات متجرك وتواصلي مع إدارة menu.' }
        : { title: 'الطلب تحت المراجعة', note: 'تراجع الإدارة بياناتك، والرد عادةً خلال يوم عمل.' };

  const handleSignOut = async () => {
    await signOutUser();
    navigation.replace('Main');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.greeting}>أهلًا {profile?.name || ''}</Text>
        <Pressable onPress={handleSignOut} style={styles.logoutChip}>
          <Text style={styles.logoutText}>خروج</Text>
        </Pressable>
      </View>

      <View style={[styles.statusCard, status === 'approved' ? styles.statusApproved : styles.statusPending]}>
        <View style={styles.statusIconWrap}>
          <Ionicons
            name={status === 'approved' ? 'checkmark-circle' : 'time-outline'}
            size={20}
            color={status === 'approved' ? brandColors.sage800 : brandColors.accent800}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.statusTitle,
              { color: status === 'approved' ? brandColors.sage900 : brandColors.accent900 },
            ]}
          >
            {statusCopy.title}
          </Text>
          <Text style={styles.statusNote}>{statusCopy.note}</Text>
        </View>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          تسجيل الدخول والحساب مربوطين الآن بخادم حقيقي (Firebase). لوحة إدارة القائمة والمنتجات
          (المنيو، بيانات المتجر، المشاركة) هي الخطوة الجاية.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: brandColors.bg, padding: 20, paddingTop: 58 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: brandColors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  greeting: { fontFamily: brandFont.arExtraBold, fontSize: 18, color: brandColors.text },
  logoutChip: {
    backgroundColor: brandColors.chip06,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  logoutText: { fontFamily: brandFont.arBold, fontSize: 11.5, color: brandColors.text },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    ...brandShadow.card,
  },
  statusPending: { backgroundColor: brandColors.accent100 },
  statusApproved: { backgroundColor: brandColors.sage100 },
  statusIconWrap: { paddingTop: 2 },
  statusTitle: { fontFamily: brandFont.arExtraBold, fontSize: 15 },
  statusNote: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink55, marginTop: 4, lineHeight: 19 },
  noteBox: {
    backgroundColor: brandColors.chip06,
    borderRadius: 18,
    padding: 15,
  },
  noteText: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink55, lineHeight: 20 },
});
