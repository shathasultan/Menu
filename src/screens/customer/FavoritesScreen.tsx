import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { useFavorites } from '../../customer/FavoritesContext';

export function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>المفضلة</Text>
      <Text style={styles.sub}>الأصناف التي حفظتها لتطلبها لاحقًا بالكود.</Text>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Mascot variant="calm" size={86} />
          <Text style={styles.emptyTitle}>لا أصناف في المفضلة بعد</Text>
          <Text style={styles.emptyText}>اضغطي على "إضافة إلى المفضلة" داخل أي صنف لحفظه هنا.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {favorites.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => navigation.navigate('VenueDetail', { venueId: f.venueId })}
              style={styles.row}
            >
              <View style={styles.codeChip}>
                <Text style={styles.codeText}>{f.code}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.rowName} numberOfLines={1}>{f.nameAr}</Text>
                <Text style={styles.rowVenue} numberOfLines={1}>{f.venueName}</Text>
              </View>
              <Text style={styles.rowPrice}>{f.price} ر.س</Text>
              <Pressable onPress={() => toggleFavorite(f)} hitSlop={8}>
                <Text style={styles.removeText}>✕</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: brandFont.arExtraBold, fontSize: 20, color: brandColors.text },
  sub: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55, marginTop: 4, marginBottom: 20 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyTitle: { fontFamily: brandFont.arBold, fontSize: 14.5, color: brandColors.text },
  emptyText: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55, textAlign: 'center', lineHeight: 21, paddingHorizontal: 24 },
  list: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: brandColors.chip06 },
  codeChip: { backgroundColor: brandColors.accent100, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  codeText: { fontFamily: brandFont.enExtraBold, fontSize: 13, color: brandColors.accent800, writingDirection: 'ltr' },
  rowName: { fontFamily: brandFont.arBold, fontSize: 14, color: brandColors.text },
  rowVenue: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink55, marginTop: 1 },
  rowPrice: { fontFamily: brandFont.enBold, fontSize: 13, color: brandColors.text, writingDirection: 'ltr' },
  removeText: { fontSize: 15, color: brandColors.ink40, paddingHorizontal: 4 },
});
