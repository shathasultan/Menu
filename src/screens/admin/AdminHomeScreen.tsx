import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { useAuth } from '../../firebase/AuthContext';
import { signOutUser } from '../../firebase/authService';
import {
  fetchMerchantEmail,
  listenVenuesByStatus,
  setVenueStatus,
} from '../../firebase/adminService';
import type { Venue } from '../../firebase/types';
import { Toast } from '../../brand/Toast';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminHome'>;

export function AdminHomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [pending, setPending] = useState<Venue[]>([]);
  const [approved, setApproved] = useState<Venue[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => listenVenuesByStatus('pending', setPending), []);
  useEffect(() => listenVenuesByStatus('approved', setApproved), []);

  const totalProducts =
    pending.reduce((sum, v) => sum + (v.productIds?.length ?? 0), 0) +
    approved.reduce((sum, v) => sum + (v.productIds?.length ?? 0), 0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigation.replace('Main');
  };

  const approve = (v: Venue) => setVenueStatus(v.id, 'approved').then(() => showToast(`تم اعتماد ${v.name || 'المطعم'}`));
  const reject = (v: Venue) => setVenueStatus(v.id, 'rejected').then(() => showToast(`تم رفض طلب ${v.name || 'المطعم'}`));
  const suspend = (v: Venue) => setVenueStatus(v.id, 'pending').then(() => showToast(`تم إيقاف عرض ${v.name || 'المطعم'}`));

  return (
    <View style={styles.screen}>
      <View style={styles.darkSection}>
        <View style={styles.decorCircle} />
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={styles.wordmark}>
              menu<Text style={{ color: brandColors.accent }}>.</Text> <Text style={styles.adminTag}>الإدارة</Text>
            </Text>
            <Text style={styles.email}>{profile?.email}</Text>
          </View>
          <Pressable onPress={handleSignOut} style={styles.logoutChip}>
            <Text style={styles.logoutText}>خروج</Text>
          </Pressable>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statTile}>
            <Text style={styles.statNum}>{pending.length}</Text>
            <Text style={styles.statLabel}>طلب جديد</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statNum}>{approved.length}</Text>
            <Text style={styles.statLabel}>مطعم منشور</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statNum}>{totalProducts}</Text>
            <Text style={styles.statLabel}>منتج</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + 30 }]}>
        <Text style={styles.sectionTitle}>طلبات بانتظار الموافقة</Text>
        <Text style={styles.sectionSub}>لا يظهر المطعم للعملاء إلا بعد اعتماده.</Text>

        {pending.length === 0 ? (
          <View style={styles.emptyPanel}>
            <Mascot variant="apron" size={76} />
            <Text style={styles.emptyText}>لا توجد طلبات جديدة حاليًا.</Text>
          </View>
        ) : (
          <View style={{ gap: 12, marginTop: 12 }}>
            {pending.map((v) => (
              <PendingVenueCard key={v.id} venue={v} onApprove={() => approve(v)} onReject={() => reject(v)} />
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 26 }]}>المطاعم المنشورة</Text>
        {approved.length === 0 ? (
          <Text style={styles.emptyTextSmall}>ما فيه مطاعم منشورة حاليًا.</Text>
        ) : (
          <View style={{ gap: 10, marginTop: 12 }}>
            {approved.map((v) => (
              <View key={v.id} style={styles.compactRow}>
                <View style={styles.logoSlotSmall} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.venueNameSmall}>{v.name?.trim() || 'متجر بدون اسم'}</Text>
                  <Text style={styles.venueMetaSmall}>{v.type?.trim() || ''}</Text>
                </View>
                <Pressable onPress={() => suspend(v)} style={styles.suspendChip}>
                  <Text style={styles.suspendText}>إيقاف</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Toast message={toast} />
    </View>
  );
}

function PendingVenueCard({ venue, onApprove, onReject }: { venue: Venue; onApprove: () => void; onReject: () => void }) {
  const productCount = venue.productIds?.length ?? 0;
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchMerchantEmail(venue.ownerId).then(setEmail);
  }, [venue.ownerId]);

  return (
    <View style={styles.pendingCard}>
      <View style={styles.pendingRow}>
        <View style={styles.logoSlot} />
        <View style={{ flex: 1 }}>
          <Text style={styles.venueName}>{venue.name?.trim() || 'متجر بدون اسم بعد'}</Text>
          <Text style={styles.venueMeta}>
            {venue.type?.trim() || 'نوع غير محدد'} · {productCount} منتج
          </Text>
          {!!email && <Text style={styles.venueEmail}>{email}</Text>}
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>تحت المراجعة</Text>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <Pressable onPress={onApprove} style={styles.approveBtn}>
          <Text style={styles.approveText}>اعتماد ونشر</Text>
        </Pressable>
        <Pressable onPress={onReject} style={styles.rejectBtn}>
          <Text style={styles.rejectText}>رفض</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  darkSection: { backgroundColor: brandColors.adminBg, overflow: 'hidden' },
  decorCircle: {
    position: 'absolute',
    top: -60,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  wordmark: { fontFamily: brandFont.enExtraBold, fontSize: 22, color: '#fff' },
  adminTag: { fontFamily: brandFont.arBold, fontSize: 12, color: brandColors.white60 },
  email: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.white55, writingDirection: 'ltr', marginTop: 4 },
  logoutChip: { backgroundColor: brandColors.white12, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  logoutText: { fontFamily: brandFont.arBold, fontSize: 11.5, color: '#fff' },
  statRow: { flexDirection: 'row', gap: 9, paddingHorizontal: 20, paddingBottom: 22 },
  statTile: { flex: 1, backgroundColor: brandColors.white08, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 11 },
  statNum: { fontFamily: brandFont.enExtraBold, fontSize: 21, color: '#fff' },
  statLabel: { fontFamily: brandFont.arRegular, fontSize: 10.5, color: brandColors.white55, marginTop: 2 },
  body: { flex: 1, backgroundColor: '#fff' },
  bodyContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30 },
  sectionTitle: { fontFamily: brandFont.arExtraBold, fontSize: 16, color: brandColors.text },
  sectionSub: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink55, marginTop: 3 },
  emptyPanel: { backgroundColor: brandColors.sage100, borderRadius: 24, alignItems: 'center', paddingVertical: 26, marginTop: 14, gap: 10 },
  emptyText: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.sage900, lineHeight: 22 },
  emptyTextSmall: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink50, marginTop: 8 },
  pendingCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: brandColors.border09,
    borderRadius: 24,
    padding: 14,
    shadowColor: '#201E1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },
  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoSlot: { width: 66, height: 66, borderRadius: 20, backgroundColor: brandColors.accent100 },
  venueName: { fontFamily: brandFont.arExtraBold, fontSize: 15.5, lineHeight: 20, color: brandColors.text },
  venueMeta: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink50, marginTop: 3 },
  venueEmail: { fontFamily: brandFont.enRegular, fontSize: 11, color: brandColors.ink42, writingDirection: 'ltr', marginTop: 2 },
  badge: { backgroundColor: brandColors.accent100, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontFamily: brandFont.arBold, fontSize: 10, color: brandColors.accent900 },
  actionsRow: { flexDirection: 'row', gap: 9, marginTop: 12 },
  approveBtn: { flex: 1, backgroundColor: brandColors.sage, borderRadius: 999, paddingVertical: 11, alignItems: 'center' },
  approveText: { fontFamily: brandFont.arBold, fontSize: 13, color: '#fff' },
  rejectBtn: { borderWidth: 1, borderColor: brandColors.border12, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  rejectText: { fontFamily: brandFont.arBold, fontSize: 13, color: brandColors.ink55 },
  compactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: brandColors.border09, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 11 },
  logoSlotSmall: { width: 44, height: 44, borderRadius: 14, backgroundColor: brandColors.sage100 },
  venueNameSmall: { fontFamily: brandFont.arExtraBold, fontSize: 14, color: brandColors.text },
  venueMetaSmall: { fontFamily: brandFont.arRegular, fontSize: 11, color: brandColors.ink55, marginTop: 2 },
  suspendChip: { backgroundColor: brandColors.chip06, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  suspendText: { fontFamily: brandFont.arBold, fontSize: 11, color: brandColors.text },
});
