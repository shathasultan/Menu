import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont, brandShadow } from '../../brand/theme';
import { useAuth } from '../../firebase/AuthContext';
import { signOutUser } from '../../firebase/authService';
import { MenuTab } from './tabs/MenuTab';
import { VenueTab } from './tabs/VenueTab';
import { AccountTab } from './tabs/AccountTab';
import { Toast } from '../../brand/Toast';

type Props = NativeStackScreenProps<RootStackParamList, 'OwnerHome'>;

type TabKey = 'menu' | 'venue' | 'account';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'menu', label: 'المنيو', icon: 'menu-outline' },
  { key: 'venue', label: 'مطعمي', icon: 'briefcase-outline' },
  { key: 'account', label: 'حسابي', icon: 'person-circle-outline' },
];

export function OwnerDashboardScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { firebaseUser, profile, venue, loading, refreshVenue } = useAuth();
  const [tab, setTab] = useState<TabKey>('menu');
  const [toast, setToast] = useState<string | null>(null);
  const welcomedRef = useRef(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    if (route.params?.justSignedIn && profile && !welcomedRef.current) {
      welcomedRef.current = true;
      showToast(`أهلًا ${profile.name}`);
    }
  }, [route.params?.justSignedIn, profile]);

  // Only redirect once we're sure there's truly no session — never during
  // render (calling navigation there while profile/venue are still catching
  // up after signup retriggers this render and loops: "Maximum update depth
  // exceeded"). While signed in but profile/venue haven't loaded yet, the
  // loading branch below just keeps waiting instead of bouncing away.
  useEffect(() => {
    if (!loading && !firebaseUser) {
      navigation.replace('MerchantAuth');
    }
  }, [loading, firebaseUser, navigation]);

  if (loading || (firebaseUser && (!profile || !venue))) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={brandColors.sage} />
      </View>
    );
  }

  if (!firebaseUser || !profile || !venue) {
    return null;
  }

  const handleSignOut = async () => {
    await signOutUser();
    navigation.replace('Main');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.storeName} numberOfLines={1}>
          {venue.name?.trim() ? venue.name : 'متجرك'}
        </Text>
        <Pressable onPress={handleSignOut} style={styles.logoutChip}>
          <Text style={styles.logoutText}>خروج</Text>
        </Pressable>
      </View>

      {venue.status !== 'approved' && (
        <View style={styles.pendingBanner}>
          <View style={styles.pendingIconWrap}>
            <Ionicons name="time-outline" size={16} color={brandColors.accent700} />
          </View>
          <Text style={styles.pendingText}>
            {venue.status === 'rejected'
              ? 'تم رفض طلبك. راجعي بيانات متجرك وتواصلي مع إدارة menu.'
              : 'طلبك قيد مراجعة الإدارة. يمكنك تجهيز قائمتك الآن، وتُنشر للعملاء فور الاعتماد.'}
          </Text>
        </View>
      )}

      <View style={styles.body}>
        {tab === 'menu' && <MenuTab venueId={venue.id} onToast={showToast} />}
        {tab === 'venue' && <VenueTab venue={venue} onSaved={() => { refreshVenue(); showToast('تم حفظ بيانات المتجر'); }} />}
        {tab === 'account' && <AccountTab profile={profile} onToast={showToast} />}
      </View>

      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 10 }]}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={styles.tabBtn}>
              <Ionicons name={t.icon} size={21} color={active ? brandColors.sage700 : brandColors.ink35} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: brandColors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: brandColors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: brandColors.sage100,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  storeName: { fontFamily: brandFont.arExtraBold, fontSize: 17, color: brandColors.text, flexShrink: 1 },
  logoutChip: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  logoutText: { fontFamily: brandFont.arBold, fontSize: 11.5, color: brandColors.sage900 },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: -8,
    ...brandShadow.card,
  },
  pendingIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: brandColors.accent100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingText: { flex: 1, fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink65, lineHeight: 18, marginTop: 4 },
  body: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: brandColors.border08,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  tabBtn: { flex: 1, alignItems: 'center', gap: 4 },
  tabLabel: { fontFamily: brandFont.arBold, fontSize: 10.5, color: brandColors.ink40 },
  tabLabelActive: { color: brandColors.sage700 },
});
