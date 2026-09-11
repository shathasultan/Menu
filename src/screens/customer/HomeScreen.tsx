// bt:ec52ad88d4b0903b
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useData } from '../../data/DataContext';
import { searchAll } from '../../data/repo';
import { colors, fontFamily, radius, shadow, spacing } from '../../theme';
import { RestaurantCard } from '../../components/RestaurantCard';
import { CodeChip } from '../../components/CodeChip';
import { formatPrice } from '../../utils/format';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { db } = useData();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!db || !query.trim()) return null;
    return searchAll(db, query);
  }, [db, query]);

  if (!db) return null;

  return (
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث باسم المطعم، الصنف، أو الكود"
          placeholderTextColor={colors.inkFaint}
          style={styles.searchInput}
        />
        <Ionicons name="search" size={18} color={colors.inkFaint} style={styles.searchIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {results ? (
          <View style={{ gap: spacing.lg }}>
            {results.restaurants.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>مطاعم</Text>
                <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
                  {results.restaurants.map((r) => (
                    <RestaurantCard
                      key={r.id}
                      restaurant={r}
                      onPress={() => navigation.navigate('Restaurant', { slug: r.slug })}
                    />
                  ))}
                </View>
              </View>
            )}
            {results.products.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>أصناف</Text>
                <View style={styles.resultCard}>
                  {results.products.map((hit, i) => (
                    <Pressable
                      key={hit.product.id}
                      onPress={() => navigation.navigate('Restaurant', { slug: hit.restaurant.slug })}
                      style={[
                        styles.resultRow,
                        i === results.products.length - 1 && styles.resultRowLast,
                      ]}
                    >
                      <CodeChip code={hit.product.code} />
                      <View style={styles.resultBody}>
                        <Text style={styles.resultName}>{hit.product.name}</Text>
                        <Text style={styles.resultRestaurant}>{hit.restaurant.name}</Text>
                      </View>
                      <Text style={styles.resultPrice}>{formatPrice(hit.product.price)}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
            {results.restaurants.length === 0 && results.products.length === 0 && (
              <View style={styles.empty}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="search" size={22} color={colors.inkFaint} />
                </View>
                <Text style={styles.emptyTitle}>لا نتائج لـ«{query}»</Text>
                <Text style={styles.emptyText}>جرّب اسم مطعم، اسم صنف، أو كود مثل A01.</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>المطاعم القريبة منك</Text>
            <Text style={styles.sectionSub}>{db.restaurants.length} مشروع طعام صغير على منيو</Text>
            <View style={{ gap: spacing.md, marginTop: spacing.md }}>
              {db.restaurants.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onPress={() => navigation.navigate('Restaurant', { slug: r.slug })}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  searchWrap: {
    position: 'relative',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    justifyContent: 'center',
  },
  searchIcon: { position: 'absolute', right: 30, top: '50%', marginTop: -9 },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingRight: 40,
    paddingLeft: 16,
    fontFamily: fontFamily.arabic,
    fontSize: 14.5,
    color: colors.ink,
    textAlign: 'right',
    ...shadow.soft,
  },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { fontFamily: fontFamily.arabicBold, fontSize: 15, color: colors.ink },
  sectionSub: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  resultCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    marginTop: spacing.sm,
    ...shadow.soft,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  resultRowLast: { borderBottomWidth: 0 },
  resultBody: { flex: 1 },
  resultName: { fontFamily: fontFamily.arabicSemiBold, fontSize: 14, color: colors.ink },
  resultRestaurant: { fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkSoft },
  resultPrice: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    color: colors.ink,
    writingDirection: 'ltr',
  },
  empty: { paddingVertical: 36, alignItems: 'center' },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: { fontFamily: fontFamily.arabicSemiBold, fontSize: 14.5, color: colors.inkSoft },
  emptyText: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkFaint, marginTop: 4 },
});
