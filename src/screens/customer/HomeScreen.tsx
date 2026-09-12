import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont, brandShadow } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { VenueLogo } from '../../brand/VenueLogo';
import { listenApprovedVenues } from '../../firebase/customerService';
import type { Venue } from '../../firebase/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const [venues, setVenues] = useState<Venue[] | null>(null);
  const [activeType, setActiveType] = useState<string>('الكل');

  useEffect(() => listenApprovedVenues(setVenues), []);

  const types = useMemo(() => {
    if (!venues) return ['الكل'];
    const set = new Set<string>();
    venues.forEach((v) => v.type?.trim() && set.add(v.type.trim()));
    return ['الكل', ...Array.from(set)];
  }, [venues]);

  const filtered = useMemo(() => {
    if (!venues) return [];
    if (activeType === 'الكل') return venues;
    return venues.filter((v) => v.type === activeType);
  }, [venues, activeType]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.greeting}>أهلًا بك 👋</Text>
        <Text style={styles.sub}>وش تشتهي اليوم؟</Text>
        <Pressable onPress={() => navigation.navigate('Search')} style={styles.searchBar}>
          <Ionicons name="search" size={17} color={brandColors.ink50} />
          <Text style={styles.searchPlaceholder}>ابحث بالرمز أو اسم المطعم</Text>
        </Pressable>
      </View>

      {venues === null ? (
        <View style={styles.center}>
          <Mascot variant="calm" size={80} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {types.map((t) => {
              const active = t === activeType;
              return (
                <Pressable key={t} onPress={() => setActiveType(t)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{t}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.countLine}>{filtered.length} مكان</Text>

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Mascot variant="calm" size={86} />
              <Text style={styles.emptyText}>لا توجد مطاعم منشورة بهذا التصنيف حاليًا.</Text>
            </View>
          ) : (
            <View style={{ gap: 12, marginTop: 12 }}>
              {filtered.map((v) => (
                <Pressable
                  key={v.id}
                  onPress={() => navigation.navigate('VenueDetail', { venueId: v.id })}
                  style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                >
                  <VenueLogo name={v.name} seed={v.id} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.cardName} numberOfLines={1}>{v.name?.trim() || 'متجر'}</Text>
                    {!!v.type && <Text style={styles.cardType}>{v.type}</Text>}
                    {!!v.address && <Text style={styles.cardAddress} numberOfLines={1}>{v.address}</Text>}
                  </View>
                  <Ionicons name="chevron-back" size={18} color={brandColors.ink40} />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  greeting: { fontFamily: brandFont.arExtraBold, fontSize: 20, color: brandColors.text },
  sub: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55, marginTop: 3, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: brandColors.chip06,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 6,
  },
  searchPlaceholder: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink50 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  chipsRow: { marginTop: 10, marginBottom: 4 },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: brandColors.border12,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginLeft: 8,
  },
  chipActive: { backgroundColor: brandColors.text, borderColor: brandColors.text },
  chipText: { fontFamily: brandFont.arBold, fontSize: 12.5, color: brandColors.ink55 },
  chipTextActive: { color: '#fff' },
  countLine: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink50, marginTop: 12 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55, textAlign: 'center', lineHeight: 21, paddingHorizontal: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: brandColors.border09,
    borderRadius: 24,
    padding: 14,
    ...brandShadow.card,
  },
  cardPressed: { opacity: 0.92 },
  cardName: { fontFamily: brandFont.arExtraBold, fontSize: 15, color: brandColors.text },
  cardType: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink55, marginTop: 2 },
  cardAddress: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink40, marginTop: 2 },
});
