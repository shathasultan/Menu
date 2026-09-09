// bt:ec52ad88d4b0903b
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Restaurant } from '../types';
import { colors, fontFamily, radius, spacing } from '../theme';
import { Avatar } from './Avatar';
import { StatusPill } from './StatusPill';

export function RestaurantCard({
  restaurant,
  onPress,
}: {
  restaurant: Restaurant;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Avatar name={restaurant.name} hue={restaurant.hue} />
      <View style={styles.body}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.tagline} numberOfLines={1}>
          {restaurant.tagline}
        </Text>
        <View style={styles.metaRow}>
          <StatusPill status={restaurant.status} />
          <Text style={styles.type}>{restaurant.type}</Text>
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
    padding: 14,
    alignItems: 'flex-start',
  },
  pressed: { borderColor: colors.accent },
  body: { flex: 1, minWidth: 0 },
  name: { fontFamily: fontFamily.arabicBold, fontSize: 15, color: colors.ink },
  tagline: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkSoft, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  type: { fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkFaint },
});
