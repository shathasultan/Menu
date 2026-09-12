import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFont } from '../../brand/theme';
import type { VenueCategory, VenueProduct } from '../../firebase/types';
import { addProduct, previewNextCode, updateProduct } from '../../firebase/venueService';

interface Props {
  visible: boolean;
  venueId: string;
  categories: VenueCategory[];
  defaultCategoryId: string | null;
  product: VenueProduct | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function ProductFormSheet({ visible, venueId, categories, defaultCategoryId, product, onClose, onSaved }: Props) {
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? categories[0]?.id ?? '');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setCategoryId(product?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? '');
      setNameAr(product?.nameAr ?? '');
      setNameEn(product?.nameEn ?? '');
      setPrice(product ? String(product.price) : '');
      setError(null);
    }
  }, [visible, product, defaultCategoryId, categories]);

  const category = categories.find((c) => c.id === categoryId);
  const codePreview = product ? product.code : previewNextCode(category);

  const handleSave = async () => {
    const priceNum = Number(price);
    if (!nameAr.trim()) {
      setError('الرجاء إدخال اسم الصنف.');
      return;
    }
    if (!categoryId) {
      setError('الرجاء اختيار تصنيف.');
      return;
    }
    if (!price.trim() || Number.isNaN(priceNum) || priceNum < 0 || priceNum > 999) {
      setError('الرجاء إدخال سعر صحيح بين 0 و999.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (product) {
        await updateProduct(venueId, product.id, { nameAr: nameAr.trim(), nameEn: nameEn.trim(), price: priceNum, categoryId });
        onSaved('تم حفظ التعديلات');
      } else {
        await addProduct(venueId, { categoryId, nameAr: nameAr.trim(), nameEn: nameEn.trim(), price: priceNum });
        onSaved('تمت إضافة الصنف');
      }
    } catch {
      setError('تعذّر الحفظ. حاولي مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={18} color={brandColors.ink55} />
            </Pressable>
            <Text style={styles.title}>{product ? 'تعديل الصنف' : 'إضافة صنف جديد'}</Text>

            <View style={styles.codePreviewRow}>
              <Text style={styles.codePreviewLabel}>الرمز</Text>
              <View style={styles.codePreviewChip}>
                <Text style={styles.codePreviewText}>{codePreview}</Text>
              </View>
            </View>

            <Text style={styles.label}>التصنيف</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setCategoryId(c.id)}
                  style={[styles.catOpt, categoryId === c.id && styles.catOptActive]}
                >
                  <Text style={[styles.catOptText, categoryId === c.id && styles.catOptTextActive]}>{c.letter} · {c.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.label}>الاسم بالعربي</Text>
            <TextInput value={nameAr} onChangeText={setNameAr} style={styles.input} placeholder="مثال: لاتيه" placeholderTextColor={brandColors.ink40} />

            <Text style={styles.label}>الاسم بالإنجليزي (اختياري)</Text>
            <TextInput value={nameEn} onChangeText={setNameEn} style={[styles.input, styles.ltr]} placeholder="Latte" placeholderTextColor={brandColors.ink40} />

            <Text style={styles.label}>السعر (ر.س)</Text>
            <TextInput value={price} onChangeText={setPrice} style={[styles.input, styles.ltr]} keyboardType="numeric" placeholder="0" placeholderTextColor={brandColors.ink40} />

            <View style={styles.imgSlotBox}>
              <Ionicons name="image-outline" size={18} color={brandColors.ink40} />
              <Text style={styles.imgSlotText}>صور الأطباق غير متاحة بعد</Text>
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable onPress={handleSave} disabled={saving} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }, saving && { opacity: 0.6 }]}>
              <Text style={styles.ctaText}>{product ? 'حفظ التعديلات' : 'إضافة الصنف'}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(32,30,29,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 34, maxHeight: '88%' },
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
  title: { fontFamily: brandFont.arExtraBold, fontSize: 17, color: brandColors.text, marginBottom: 14 },
  codePreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  codePreviewLabel: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink55 },
  codePreviewChip: { backgroundColor: brandColors.accent100, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  codePreviewText: { fontFamily: brandFont.enExtraBold, fontSize: 16, color: brandColors.accent800, writingDirection: 'ltr' },
  label: { fontFamily: brandFont.arBold, fontSize: 11.5, color: brandColors.ink50, marginBottom: 6 },
  catOpt: { borderWidth: 1, borderColor: brandColors.border12, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8, marginLeft: 8 },
  catOptActive: { backgroundColor: brandColors.text, borderColor: brandColors.text },
  catOptText: { fontFamily: brandFont.arBold, fontSize: 12, color: brandColors.ink55 },
  catOptTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: brandColors.border12,
    borderRadius: 999,
    paddingHorizontal: 17,
    paddingVertical: 13,
    fontFamily: brandFont.arRegular,
    fontSize: 14,
    color: brandColors.text,
    textAlign: 'right',
    marginBottom: 12,
  },
  ltr: { writingDirection: 'ltr', fontFamily: brandFont.enRegular },
  imgSlotBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: brandColors.chip06,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  imgSlotText: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink50 },
  errorText: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.accent800, marginBottom: 12, lineHeight: 18 },
  cta: { backgroundColor: brandColors.accent, borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  ctaText: { fontFamily: brandFont.arExtraBold, fontSize: 15, color: '#fff' },
});
