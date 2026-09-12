import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { VenueLogo } from '../../brand/VenueLogo';
import { Toast } from '../../brand/Toast';
import { getApprovedVenue, listenVenueCategories, listenVenueProducts } from '../../firebase/customerService';
import type { Venue, VenueCategory, VenueProduct } from '../../firebase/types';
import { useFavorites } from '../../customer/FavoritesContext';
import { ProductDetailSheet } from './ProductDetailSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'VenueDetail'>;

export function VenueDetailScreen({ route }: Props) {
  const { venueId } = route.params;
  const [venue, setVenue] = useState<Venue | null | undefined>(undefined);
  const [categories, setCategories] = useState<VenueCategory[]>([]);
  const [products, setProducts] = useState<VenueProduct[]>([]);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<VenueProduct | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    getApprovedVenue(venueId).then(setVenue);
  }, [venueId]);

  useEffect(() => listenVenueCategories(venueId, setCategories), [venueId]);
  useEffect(() => listenVenueProducts(venueId, setProducts), [venueId]);

  const filteredProducts = useMemo(() => {
    if (!activeCatId) return products;
    return products.filter((p) => p.categoryId === activeCatId);
  }, [products, activeCatId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleShare = async () => {
    await Clipboard.setStringAsync(`https://menu.app/v/${venueId}`);
    showToast('تم نسخ رابط القائمة');
  };

  if (venue === undefined) return null;

  if (venue === null) {
    return (
      <View style={styles.center}>
        <Mascot variant="calm" size={86} />
        <Text style={styles.notFoundText}>هذا المطعم غير متاح حاليًا.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <VenueLogo name={venue.name} seed={venue.id} size={60} radius={18} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{venue.name?.trim() || 'متجر'}</Text>
            {!!venue.type && <Text style={styles.type}>{venue.type}</Text>}
          </View>
          <Pressable onPress={handleShare} style={styles.shareBtn} hitSlop={8}>
            <Ionicons name="share-social-outline" size={19} color={brandColors.ink55} />
          </Pressable>
        </View>

        {!!venue.address && <Text style={styles.address}>{venue.address}</Text>}

        {categories.length === 0 ? (
          <View style={styles.emptyMenu}>
            <Mascot variant="calm" size={86} />
            <Text style={styles.emptyText}>لا قائمة متاحة بعد.</Text>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
              <Pressable onPress={() => setActiveCatId(null)} style={[styles.catTab, !activeCatId && styles.catTabActive]}>
                <Text style={[styles.catTabText, !activeCatId && styles.catTabTextActive]}>الكل</Text>
              </Pressable>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setActiveCatId(c.id)}
                  style={[styles.catTab, activeCatId === c.id && styles.catTabActive]}
                >
                  <Text style={[styles.catTabText, activeCatId === c.id && styles.catTabTextActive]}>
                    {c.letter} · {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={{ marginTop: 6 }}>
              {filteredProducts.map((p, i, arr) => (
                <Pressable
                  key={p.id}
                  onPress={() => setDetailProduct(p)}
                  style={[styles.row, i === arr.length - 1 && styles.rowLast, !p.available && styles.rowOut]}
                >
                  <Text style={styles.rowCode}>{p.code}</Text>
                  <View style={styles.rowThumb} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.rowName} numberOfLines={1}>{p.nameAr}</Text>
                    {!!p.nameEn && <Text style={styles.rowNameEn} numberOfLines={1}>{p.nameEn}</Text>}
                  </View>
                  <Text style={styles.rowPrice}>{p.price} ر.س</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <ProductDetailSheet
        product={detailProduct}
        venueName={venue.name}
        favorite={detailProduct ? isFavorite(`${venue.id}|${detailProduct.code}`) : false}
        onClose={() => setDetailProduct(null)}
        onToggleFavorite={() => {
          if (!detailProduct) return;
          toggleFavorite({
            key: `${venue.id}|${detailProduct.code}`,
            venueId: venue.id,
            venueName: venue.name,
            productId: detailProduct.id,
            code: detailProduct.code,
            nameAr: detailProduct.nameAr,
            price: detailProduct.price,
          });
        }}
      />
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', gap: 12 },
  notFoundText: { fontFamily: brandFont.arRegular, fontSize: 13.5, color: brandColors.ink55 },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { fontFamily: brandFont.arExtraBold, fontSize: 18, color: brandColors.text },
  type: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink55, marginTop: 2 },
  shareBtn: { width: 38, height: 38, borderRadius: 999, borderWidth: 1, borderColor: brandColors.border12, alignItems: 'center', justifyContent: 'center' },
  address: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink50, marginTop: 10 },
  emptyMenu: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55 },
  catRow: { marginTop: 20, marginBottom: 6 },
  catTab: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, marginLeft: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: brandColors.border12 },
  catTabActive: { backgroundColor: brandColors.text, borderColor: brandColors.text },
  catTabText: { fontFamily: brandFont.arBold, fontSize: 12.5, color: brandColors.ink55 },
  catTabTextActive: { color: '#fff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: brandColors.chip07,
  },
  rowLast: { borderBottomWidth: 0 },
  rowOut: { opacity: 0.45 },
  rowCode: { fontFamily: brandFont.enExtraBold, fontSize: 26, color: brandColors.accent, writingDirection: 'ltr', minWidth: 52 },
  rowThumb: { width: 40, height: 40, borderRadius: 12, backgroundColor: brandColors.chip06 },
  rowName: { fontFamily: brandFont.arExtraBold, fontSize: 14, color: brandColors.text },
  rowNameEn: { fontFamily: brandFont.enRegular, fontSize: 10.5, color: brandColors.ink42, writingDirection: 'ltr', marginTop: 1 },
  rowPrice: { fontFamily: brandFont.enBold, fontSize: 14, color: brandColors.text, writingDirection: 'ltr' },
});
