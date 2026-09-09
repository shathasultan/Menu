// bt:ec52ad88d4b0903b
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useData } from '../../data/DataContext';
import { getRestaurant, isFavorite, toggleFavorite } from '../../data/repo';
import type { Product } from '../../types';
import { colors, fontFamily, radius, spacing } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { StatusPill } from '../../components/StatusPill';
import { ProductCard } from '../../components/ProductCard';
import { ProductDetailModal } from '../../components/ProductDetailModal';
import { ShareSheet } from '../../components/ShareSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Restaurant'>;

export function RestaurantScreen({ route, navigation }: Props) {
  const { slug } = route.params;
  const { db, mutate } = useData();
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const restaurant = db ? getRestaurant(db, slug) : undefined;

  const activeCatId = useMemo(() => {
    if (!restaurant) return null;
    if (activeCat && restaurant.categories.some((c) => c.id === activeCat)) return activeCat;
    return restaurant.categories[0]?.id ?? null;
  }, [restaurant, activeCat]);

  if (!db) return null;

  if (!restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>المطعم غير موجود</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>العودة</Text>
        </Pressable>
      </View>
    );
  }

  const handleToggleFavorite = (productId: string) => {
    mutate((current) => toggleFavorite(current, productId));
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerTop}>
          <Avatar name={restaurant.name} hue={restaurant.hue} size={60} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.tagline}>{restaurant.tagline}</Text>
            <StatusPill status={restaurant.status} />
          </View>
          <Pressable onPress={() => setShareOpen(true)} style={styles.shareBtn} hitSlop={8}>
            <Ionicons name="share-social-outline" size={20} color={colors.inkSoft} />
          </Pressable>
        </View>

        {!!restaurant.description && <Text style={styles.desc}>{restaurant.description}</Text>}

        <View style={styles.infoRow}>
          {!!restaurant.location && <Text style={styles.infoText}>{restaurant.location}</Text>}
          {!!restaurant.hours && <Text style={styles.infoText}>{restaurant.hours}</Text>}
        </View>

        {restaurant.categories.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>لا منيو بعد</Text>
            <Text style={styles.emptyText}>صاحب هذا المطعم لم يضف أصنافًا حتى الآن.</Text>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catNav}>
              {restaurant.categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setActiveCat(c.id)}
                  style={[styles.catBtn, c.id === activeCatId && styles.catBtnActive]}
                >
                  <Text style={[styles.catBtnText, c.id === activeCatId && styles.catBtnTextActive]}>
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {restaurant.categories
              .filter((c) => c.id === activeCatId)
              .map((c) => {
                const products = restaurant.products
                  .filter((p) => p.categoryId === c.id)
                  .sort((a, b) => a.order - b.order);
                return (
                  <View key={c.id} style={styles.catBlock}>
                    <Text style={styles.catHeading}>{c.name}</Text>
                    {products.length === 0 ? (
                      <Text style={styles.emptyText}>لا أصناف في هذه الفئة بعد.</Text>
                    ) : (
                      <View style={styles.productGrid}>
                        {products.map((p) => (
                          <View key={p.id} style={styles.productCell}>
                            <ProductCard
                              product={p}
                              restaurant={restaurant}
                              favorite={isFavorite(db, p.id)}
                              onPress={() => setDetailProduct(p)}
                              onToggleFavorite={() => handleToggleFavorite(p.id)}
                            />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
          </>
        )}
      </ScrollView>

      <ProductDetailModal
        product={detailProduct}
        favorite={detailProduct ? isFavorite(db, detailProduct.id) : false}
        onClose={() => setDetailProduct(null)}
        onToggleFavorite={() => detailProduct && handleToggleFavorite(detailProduct.id)}
      />
      <ShareSheet
        visible={shareOpen}
        restaurantName={restaurant.name}
        slug={restaurant.slug}
        onClose={() => setShareOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  headerInfo: { flex: 1, gap: 4 },
  name: { fontFamily: fontFamily.arabicBold, fontSize: 19, color: colors.ink },
  tagline: { fontFamily: fontFamily.arabic, fontSize: 13.5, color: colors.inkSoft },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    fontFamily: fontFamily.arabic,
    fontSize: 13.5,
    color: colors.inkSoft,
    marginTop: spacing.md,
  },
  infoRow: { flexDirection: 'row', gap: 16, marginTop: 8, flexWrap: 'wrap' },
  infoText: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkFaint },
  catNav: { marginTop: spacing.lg, marginBottom: spacing.md },
  catBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: spacing.sm,
  },
  catBtnActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  catBtnText: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft },
  catBtnTextActive: { color: colors.bg },
  catBlock: { marginTop: spacing.sm },
  catHeading: {
    fontFamily: fontFamily.arabicBold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 10,
  },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  productCell: { width: '47%' },
  empty: { paddingVertical: 30, alignItems: 'center' },
  emptyTitle: { fontFamily: fontFamily.arabicSemiBold, fontSize: 14.5, color: colors.inkSoft },
  emptyText: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkFaint, marginTop: 4 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  notFoundTitle: { fontFamily: fontFamily.arabicSemiBold, fontSize: 15, color: colors.inkSoft },
  backLink: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.accent, marginTop: 8 },
});
