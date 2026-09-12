import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFont } from '../../brand/theme';
import type { VenueProduct } from '../../firebase/types';

interface Props {
  product: VenueProduct | null;
  venueName: string;
  favorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export function ProductDetailSheet({ product, venueName, favorite, onClose, onToggleFavorite }: Props) {
  return (
    <Modal visible={!!product} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        {product && (
          <View style={styles.sheet}>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={18} color={brandColors.ink55} />
            </Pressable>

            <View style={styles.imgSlot}>
              <Ionicons name="image-outline" size={28} color={brandColors.ink40} />
            </View>

            <View style={styles.codeChip}>
              <Text style={styles.codeText}>{product.code}</Text>
            </View>
            <Text style={styles.name}>{product.nameAr}</Text>
            {!!product.nameEn && <Text style={styles.nameEn}>{product.nameEn}</Text>}
            <Text style={styles.venue}>{venueName}</Text>
            <Text style={styles.price}>{product.price} ر.س</Text>

            <Pressable
              onPress={onToggleFavorite}
              style={[styles.favBtn, favorite ? styles.favBtnOn : styles.favBtnOff]}
            >
              <Text style={[styles.favText, { color: favorite ? brandColors.sage900 : '#fff' }]}>
                {favorite ? 'في المفضلة' : 'إضافة إلى المفضلة'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(32,30,29,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 34 },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: brandColors.chip06,
    borderRadius: 999,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imgSlot: { height: 140, borderRadius: 20, backgroundColor: brandColors.chip06, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  codeChip: { alignSelf: 'flex-start', backgroundColor: brandColors.accent100, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 10 },
  codeText: { fontFamily: brandFont.enExtraBold, fontSize: 18, color: brandColors.accent800, writingDirection: 'ltr' },
  name: { fontFamily: brandFont.arExtraBold, fontSize: 19, color: brandColors.text },
  nameEn: { fontFamily: brandFont.enRegular, fontSize: 12, color: brandColors.ink42, writingDirection: 'ltr', marginTop: 2 },
  venue: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink55, marginTop: 8 },
  price: { fontFamily: brandFont.enBold, fontSize: 17, color: brandColors.text, writingDirection: 'ltr', marginTop: 10, marginBottom: 20 },
  favBtn: { borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  favBtnOff: { backgroundColor: brandColors.accent },
  favBtnOn: { backgroundColor: brandColors.sage200 },
  favText: { fontFamily: brandFont.arBold, fontSize: 14.5 },
});
