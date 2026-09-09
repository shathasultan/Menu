// bt:ec52ad88d4b0903b
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '../types';
import { colors, fontFamily, radius, spacing } from '../theme';
import { CodeChip } from './CodeChip';
import { Button } from './Button';
import { formatPrice } from '../utils/format';

export function ProductDetailModal({
  product,
  favorite,
  onClose,
  onToggleFavorite,
}: {
  product: Product | null;
  favorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <Modal
      visible={!!product}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.inkSoft} />
          </Pressable>
          {product && (
            <>
              <View style={styles.chipRow}>
                <CodeChip code={product.code} large />
              </View>
              <Text style={styles.name}>{product.name}</Text>
              {!!product.description && <Text style={styles.desc}>{product.description}</Text>}
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {!product.available && <Text style={styles.soldOut}>غير متوفر حاليًا</Text>}
              <View style={styles.actions}>
                <Button
                  label={favorite ? 'في المفضلة' : 'أضف للمفضلة'}
                  variant="ghost"
                  onPress={onToggleFavorite}
                  icon={
                    <Ionicons
                      name={favorite ? 'heart' : 'heart-outline'}
                      size={16}
                      color={favorite ? colors.bad : colors.inkSoft}
                    />
                  }
                  fullWidth
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,15,8,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  chipRow: { alignItems: 'center', marginBottom: 14 },
  name: {
    fontFamily: fontFamily.arabicBold,
    fontSize: 18,
    color: colors.ink,
    textAlign: 'center',
  },
  desc: {
    fontFamily: fontFamily.arabic,
    fontSize: 13.5,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 6,
  },
  price: {
    fontFamily: fontFamily.mono,
    fontSize: 18,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 12,
    writingDirection: 'ltr',
  },
  soldOut: {
    fontFamily: fontFamily.arabicSemiBold,
    fontSize: 12,
    color: colors.bad,
    textAlign: 'center',
    marginTop: 6,
  },
  actions: { marginTop: 18 },
});
