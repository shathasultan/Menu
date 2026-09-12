import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { listenApprovedVenues, listenSearchableProducts, type SearchableProduct } from '../../firebase/customerService';
import type { Venue } from '../../firebase/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

type ProductResult = { kind: 'product'; item: SearchableProduct; venueName: string };
type VenueResult = { kind: 'venue'; item: Venue };
type Result = ProductResult | VenueResult;

export function SearchScreen({ navigation }: Props) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [products, setProducts] = useState<SearchableProduct[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => listenApprovedVenues(setVenues), []);
  useEffect(() => listenSearchableProducts(setProducts), []);

  const venueById = useMemo(() => new Map(venues.map((v) => [v.id, v])), [venues]);

  const results = useMemo<Result[] | null>(() => {
    const q = query.trim();
    if (!q) return null;
    const qLower = q.toLowerCase();

    const productMatches: ProductResult[] = products
      .filter(
        (p) =>
          p.code.toLowerCase().startsWith(qLower) ||
          p.nameAr?.toLowerCase().includes(qLower) ||
          p.nameEn?.toLowerCase().includes(qLower)
      )
      .map((p) => ({ kind: 'product' as const, item: p, venueName: venueById.get(p.venueId)?.name ?? '' }));

    const venueMatches: VenueResult[] = venues
      .filter((v) => v.name?.toLowerCase().includes(qLower) || v.type?.toLowerCase().includes(qLower))
      .map((v) => ({ kind: 'venue' as const, item: v }));

    return [...productMatches, ...venueMatches];
  }, [products, venues, venueById, query]);

  const suggestions = useMemo(() => products.slice(0, 4).map((p) => p.code), [products]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={brandColors.ink50} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="اكتب الرمز أو اسم المطعم"
            placeholderTextColor={brandColors.ink40}
            style={styles.input}
            autoFocus
            autoCapitalize="characters"
          />
        </View>
        <Text style={styles.resultLine}>
          {results === null ? 'اكتب الرمز أو الاسم، أو اختر من الاقتراحات' : `${results.length} نتيجة لـ «${query}»`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {results === null ? (
          suggestions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>اقتراحات</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {suggestions.map((code) => (
                  <Pressable key={code} onPress={() => setQuery(code)} style={styles.suggestionChip}>
                    <Text style={styles.suggestionText}>{code}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <Mascot variant="calm" size={86} />
            <Text style={styles.emptyText}>
              لا توجد نتائج لهذا الرمز.{'\n'}جرّب حرف التصنيف مع الرقم، مثل A02.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 2 }}>
            {results.map((r) =>
              r.kind === 'product' ? (
                <Pressable
                  key={`p-${r.item.venueId}-${r.item.id}`}
                  onPress={() => navigation.navigate('VenueDetail', { venueId: r.item.venueId })}
                  style={styles.resultRow}
                >
                  <View style={styles.codeChip}>
                    <Text style={styles.codeText}>{r.item.code}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.resultName} numberOfLines={1}>{r.item.nameAr}</Text>
                    <Text style={styles.resultType} numberOfLines={1}>{r.venueName}</Text>
                  </View>
                  <Text style={styles.resultPrice}>{r.item.price} ر.س</Text>
                </Pressable>
              ) : (
                <Pressable
                  key={`v-${r.item.id}`}
                  onPress={() => navigation.navigate('VenueDetail', { venueId: r.item.id })}
                  style={styles.resultRow}
                >
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.resultName} numberOfLines={1}>{r.item.name}</Text>
                    <Text style={styles.resultType} numberOfLines={1}>{r.item.type}</Text>
                  </View>
                </Pressable>
              )
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: brandColors.chip06,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { flex: 1, fontFamily: brandFont.arRegular, fontSize: 14, color: brandColors.text, textAlign: 'right' },
  resultLine: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink50, marginTop: 10 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontFamily: brandFont.arBold, fontSize: 13, color: brandColors.ink55 },
  suggestionChip: { borderWidth: 1, borderColor: brandColors.border12, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, marginLeft: 8 },
  suggestionText: { fontFamily: brandFont.enExtraBold, fontSize: 12.5, color: brandColors.text, writingDirection: 'ltr' },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55, textAlign: 'center', lineHeight: 22 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: brandColors.chip07, paddingVertical: 12 },
  codeChip: { backgroundColor: brandColors.accent100, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  codeText: { fontFamily: brandFont.enExtraBold, fontSize: 13, color: brandColors.accent800, writingDirection: 'ltr' },
  resultName: { fontFamily: brandFont.arBold, fontSize: 14, color: brandColors.text },
  resultType: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink55, marginTop: 2 },
  resultPrice: { fontFamily: brandFont.enBold, fontSize: 13, color: brandColors.text, writingDirection: 'ltr' },
});
