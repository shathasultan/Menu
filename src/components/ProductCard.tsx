// bt:ec52ad88d4b0903b
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product, Restaurant } from '../types';
import { colors, fontFamily, radius, spacing } from '../theme';
import { CodeChip } from './CodeChip';
import { formatPrice } from '../utils/format';

export function ProductCard({
  product,
  restaurant,
  favorite,
  onPress,
  onToggleFavorite,
}: {
  product: Product;
  restaurant: Restaurant;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        !product.available && styles.unavailable,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.swatch,
          { backgroundColor: `hsl(${restaurant.hue}, 55%, 88%)` },
        ]}
      />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <CodeChip code={product.code} />
          {!product.available && (
            <View style={styles.soldOut}>
              <Text style={styles.soldOutText}>غير متوفر</Text>
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        {!!product.description && (
          <Text style={styles.desc} numberOfLines={1}>
            {product.description}
          </Text>
        )}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Pressable onPress={onToggleFavorite} hitSlop={8} style={styles.favBtn}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={18}
              color={favorite ? colors.bad : colors.inkSoft}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 12,
    flex: 1,
  },
  pressed: { borderColor: colors.accent },
  unavailable: { opacity: 0.55 },
  swatch: { width: 48, height: 48, borderRadius: radius.md, flexShrink: 0 },
  body: { flex: 1, minWidth: 0, gap: 3 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fontFamily.arabicSemiBold, fontSize: 14, color: colors.ink },
  desc: { fontFamily: fontFamily.arabic, fontSize: 11.5, color: colors.inkSoft },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    color: colors.ink,
    writingDirection: 'ltr',
  },
  favBtn: { padding: 2 },
  soldOut: {
    backgroundColor: colors.badSoft,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  soldOutText: { fontFamily: fontFamily.arabicSemiBold, fontSize: 10, color: colors.bad },
});
