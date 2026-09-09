// bt:ec52ad88d4b0903b
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useData } from '../../data/DataContext';
import { getRestaurant, updateRestaurant } from '../../data/repo';
import { colors, fontFamily, radius, spacing } from '../../theme';
import { StatusPill } from '../../components/StatusPill';
import { OverviewTab } from './tabs/OverviewTab';
import { ProfileTab } from './tabs/ProfileTab';
import { MenuTab } from './tabs/MenuTab';
import { ShareTab } from './tabs/ShareTab';

type Props = NativeStackScreenProps<RootStackParamList, 'OwnerDashboard'>;

type TabKey = 'overview' | 'profile' | 'menu' | 'share';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'نظرة عامة' },
  { key: 'profile', label: 'الملف الشخصي' },
  { key: 'menu', label: 'إدارة المنيو' },
  { key: 'share', label: 'مشاركة وQR' },
];

export function DashboardScreen({ route, navigation }: Props) {
  const { slug } = route.params;
  const { db, mutate } = useData();
  const [tab, setTab] = useState<TabKey>('overview');

  const restaurant = db ? getRestaurant(db, slug) : undefined;

  if (!db) return null;
  if (!restaurant) {
    navigation.replace('OwnerLogin');
    return null;
  }

  const toggleStatus = () => {
    mutate((current) =>
      updateRestaurant(current, restaurant.id, {
        status: restaurant.status === 'open' ? 'closed' : 'open',
      })
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.restName}>لوحة {restaurant.name}</Text>
        <View style={styles.topActions}>
          <Pressable onPress={() => navigation.replace('OwnerLogin')}>
            <Text style={styles.link}>تبديل مطعم</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Restaurant', { slug: restaurant.slug })}>
            <Text style={styles.link}>عرض كعميل</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statusRow}>
        <StatusPill status={restaurant.status} />
      </View>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{restaurant.products.length}</Text>
          <Text style={styles.statLabel}>أصناف</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{restaurant.categories.length}</Text>
          <Text style={styles.statLabel}>تصنيفات</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{restaurant.products.filter((p) => p.available).length}</Text>
          <Text style={styles.statLabel}>متوفر الآن</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={styles.tabBtn}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            {tab === t.key && <View style={styles.tabIndicator} />}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.tabBody}>
        {tab === 'overview' && (
          <OverviewTab
            restaurant={restaurant}
            onToggleStatus={toggleStatus}
            onSeeProduct={() => setTab('menu')}
          />
        )}
        {tab === 'profile' && <ProfileTab restaurant={restaurant} />}
        {tab === 'menu' && <MenuTab restaurant={restaurant} />}
        {tab === 'share' && <ShareTab restaurant={restaurant} />}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>بذرة التقنية</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  restName: { fontFamily: fontFamily.arabicBold, fontSize: 16, color: colors.ink, flexShrink: 1 },
  topActions: { flexDirection: 'row', gap: 14 },
  link: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkSoft },
  statusRow: { paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  statRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNum: { fontFamily: fontFamily.mono, fontSize: 18, color: colors.ink, writingDirection: 'ltr' },
  statLabel: { fontFamily: fontFamily.arabic, fontSize: 11, color: colors.inkSoft, marginTop: 2 },
  tabBar: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tabBtn: { paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center' },
  tabText: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft },
  tabTextActive: { color: colors.ink, fontFamily: fontFamily.arabicSemiBold },
  tabIndicator: { height: 2, backgroundColor: colors.accent, width: '100%', marginTop: 6, borderRadius: 1 },
  tabBody: { flex: 1 },
  footer: { alignItems: 'center', paddingVertical: spacing.lg },
  footerText: { fontFamily: fontFamily.arabic, fontSize: 11, color: colors.inkFaint },
});
