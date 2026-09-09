// bt:ec52ad88d4b0903b
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Restaurant } from '../../../types';
import { colors, fontFamily, spacing } from '../../../theme';
import { Button } from '../../../components/Button';
import { ProductCard } from '../../../components/ProductCard';
import { useData } from '../../../data/DataContext';
import { isFavorite, toggleFavorite } from '../../../data/repo';

export function OverviewTab({
  restaurant,
  onToggleStatus,
  onSeeProduct,
}: {
  restaurant: Restaurant;
  onToggleStatus: () => void;
  onSeeProduct: () => void;
}) {
  const { db, mutate } = useData();
  const recent = restaurant.products.slice(-4).reverse();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>حالة المطعم</Text>
      <Text style={styles.sectionSub}>تحكّم بظهور المطعم للعملاء كمفتوح أو مغلق الآن.</Text>
      <Button
        label={`تبديل إلى ${restaurant.status === 'open' ? 'مغلق' : 'مفتوح'}`}
        variant={restaurant.status === 'open' ? 'ghost' : 'accent'}
        onPress={onToggleStatus}
      />

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>أحدث الأصناف</Text>
      {recent.length === 0 ? (
        <Text style={styles.emptyText}>لا أصناف بعد. ابدأ من تبويب إدارة المنيو.</Text>
      ) : (
        <View style={styles.grid}>
          {recent.map((p) => (
            <View key={p.id} style={styles.cell}>
              <ProductCard
                product={p}
                restaurant={restaurant}
                favorite={db ? isFavorite(db, p.id) : false}
                onPress={onSeeProduct}
                onToggleFavorite={() => mutate((c) => toggleFavorite(c, p.id))}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { fontFamily: fontFamily.arabicBold, fontSize: 15, color: colors.ink },
  sectionSub: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft, marginTop: 4, marginBottom: 12 },
  emptyText: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkFaint, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  cell: { width: '47%' },
});
