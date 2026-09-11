// bt:ec52ad88d4b0903b
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { useData } from '../../data/DataContext';
import { listFavorites } from '../../data/repo';
import { colors, fontFamily, radius, shadow, spacing } from '../../theme';
import { CodeChip } from '../../components/CodeChip';
import { formatPrice } from '../../utils/format';

export function FavoritesScreen() {
  const { db } = useData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!db) return null;
  const favorites = listFavorites(db);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>المفضلة</Text>
      <Text style={styles.sub}>الأصناف التي حفظتها لتطلبها لاحقًا بالكود.</Text>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="heart-outline" size={22} color={colors.inkFaint} />
          </View>
          <Text style={styles.emptyTitle}>لا أصناف في المفضلة بعد</Text>
          <Text style={styles.emptyText}>اضغط على أيقونة القلب داخل أي صنف لإضافته هنا.</Text>
        </View>
      ) : (
        <View style={styles.card}>
          {favorites.map((f, i) => (
            <Pressable
              key={f.product.id}
              onPress={() => navigation.navigate('Restaurant', { slug: f.restaurant.slug })}
              style={[styles.row, i === favorites.length - 1 && styles.rowLast]}
            >
              <CodeChip code={f.product.code} />
              <View style={styles.rowBody}>
                <Text style={styles.rowName}>{f.product.name}</Text>
                <Text style={styles.rowRestaurant}>{f.restaurant.name}</Text>
              </View>
              <Text style={styles.rowPrice}>{formatPrice(f.product.price)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontFamily: fontFamily.arabicBold, fontSize: 18, color: colors.ink },
  sub: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft, marginTop: 4, marginBottom: spacing.lg },
  empty: { paddingVertical: 40, alignItems: 'center' },
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
  emptyText: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkFaint, marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    ...shadow.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLast: { borderBottomWidth: 0 },
  rowBody: { flex: 1 },
  rowName: { fontFamily: fontFamily.arabicSemiBold, fontSize: 14, color: colors.ink },
  rowRestaurant: { fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkSoft },
  rowPrice: { fontFamily: fontFamily.mono, fontSize: 13, color: colors.ink, writingDirection: 'ltr' },
});
