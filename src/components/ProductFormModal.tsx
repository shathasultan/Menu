// bt:ec52ad88d4b0903b
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Category, Product } from '../types';
import { colors, fontFamily, radius, spacing } from '../theme';
import { Button } from './Button';

interface ProductFormModalProps {
  visible: boolean;
  categories: Category[];
  product: Product | null;
  defaultCategoryId: string | null;
  onClose: () => void;
  onSave: (data: { name: string; price: number; description: string; categoryId: string }) => void;
  onDelete: () => void;
}

export function ProductFormModal({
  visible,
  categories,
  product,
  defaultCategoryId,
  onClose,
  onSave,
  onDelete,
}: ProductFormModalProps) {
  const isEdit = !!product;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setName(product?.name ?? '');
      setPrice(product ? String(product.price) : '');
      setDescription(product?.description ?? '');
      setCategoryId(product?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? '');
    }
  }, [visible, product, defaultCategoryId, categories]);

  const handleSave = () => {
    const priceNum = parseInt(price, 10);
    if (!name.trim() || !priceNum || !categoryId) return;
    onSave({ name: name.trim(), price: priceNum, description: description.trim(), categoryId });
  };

  const confirmDelete = () => {
    Alert.alert('حذف الصنف', 'حذف هذا الصنف نهائيًا؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.inkSoft} />
          </Pressable>
          <Text style={styles.title}>{isEdit ? 'تعديل الصنف' : 'إضافة صنف'}</Text>
          <Text style={styles.subtitle}>
            {isEdit
              ? `الكود ${product?.code} ثابت ولا يتغير.`
              : 'سيُولَّد كود الصنف تلقائيًا عند الحفظ.'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>اسم الصنف</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>السعر (ر.س)</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
                style={styles.input}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>
                التصنيف{isEdit ? ' (عند الإنشاء فقط)' : ''}
              </Text>
              <View style={styles.catSelect}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((c) => (
                    <Pressable
                      key={c.id}
                      disabled={isEdit}
                      onPress={() => setCategoryId(c.id)}
                      style={[styles.catOption, categoryId === c.id && styles.catOptionActive]}
                    >
                      <Text
                        style={[
                          styles.catOptionText,
                          categoryId === c.id && styles.catOptionTextActive,
                        ]}
                      >
                        {c.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>وصف مختصر (اختياري)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.input, styles.textarea]}
            />
          </View>

          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <Button label={isEdit ? 'حفظ التعديلات' : 'إضافة للمنيو'} onPress={handleSave} fullWidth />
            </View>
            {isEdit && <Button label="حذف" variant="danger" onPress={confirmDelete} />}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(20,15,8,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '88%',
  },
  sheetContent: { padding: spacing.xl, paddingBottom: spacing.xxl },
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
  title: { fontFamily: fontFamily.arabicBold, fontSize: 17, color: colors.ink },
  subtitle: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkSoft, marginTop: 4, marginBottom: 16 },
  field: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  label: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkSoft, marginBottom: 5 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fontFamily.arabic,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'right',
  },
  textarea: { minHeight: 64, textAlignVertical: 'top' },
  catSelect: { flexDirection: 'row' },
  catOption: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 6,
    backgroundColor: colors.surface,
  },
  catOptionActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  catOptionText: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkSoft },
  catOptionTextActive: { color: colors.bg },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
});
