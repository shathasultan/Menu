// bt:ec52ad88d4b0903b
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product, Restaurant } from '../../../types';
import { colors, fontFamily, radius, spacing } from '../../../theme';
import { Button } from '../../../components/Button';
import { CodeChip } from '../../../components/CodeChip';
import { formatPrice } from '../../../utils/format';
import { useData } from '../../../data/DataContext';
import {
  addCategory,
  addProduct,
  deleteProduct,
  reorderProduct,
  updateProduct,
} from '../../../data/repo';
import { ProductFormModal } from '../../../components/ProductFormModal';

export function MenuTab({ restaurant }: { restaurant: Restaurant }) {
  const { mutate } = useData();
  const [newCatName, setNewCatName] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formCategoryId, setFormCategoryId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    mutate((current) => addCategory(current, restaurant.id, newCatName.trim()));
    setNewCatName('');
  };

  const openAddProduct = (categoryId: string) => {
    setEditingProduct(null);
    setFormCategoryId(categoryId);
    setFormOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormCategoryId(p.categoryId);
    setFormOpen(true);
  };

  const handleSaveProduct = (data: {
    name: string;
    price: number;
    description: string;
    categoryId: string;
  }) => {
    if (editingProduct) {
      mutate((current) =>
        updateProduct(current, restaurant.id, editingProduct.id, {
          name: data.name,
          price: data.price,
          description: data.description,
        })
      );
    } else {
      mutate((current) => addProduct(current, restaurant.id, data));
    }
    setFormOpen(false);
  };

  const handleDeleteProduct = () => {
    if (!editingProduct) return;
    mutate((current) => deleteProduct(current, restaurant.id, editingProduct.id));
    setFormOpen(false);
  };

  const confirmDelete = (p: Product) => {
    Alert.alert('حذف الصنف', 'حذف هذا الصنف نهائيًا؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => mutate((current) => deleteProduct(current, restaurant.id, p.id)),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.headRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>إدارة المنيو</Text>
          <Text style={styles.sectionSub}>الكود يُولَّد تلقائيًا ولا يتغير بعد الإنشاء.</Text>
        </View>
      </View>

      <View style={styles.addCatRow}>
        <TextInput
          value={newCatName}
          onChangeText={setNewCatName}
          placeholder="اسم تصنيف جديد"
          placeholderTextColor={colors.inkFaint}
          style={styles.addCatInput}
        />
        <Pressable onPress={handleAddCategory} style={styles.addCatBtn}>
          <Ionicons name="add" size={18} color={colors.accentInk} />
        </Pressable>
      </View>

      {restaurant.categories.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>ابدأ بإضافة تصنيف</Text>
          <Text style={styles.emptyText}>مثل «مشروبات ساخنة» أو «سناكس»، ثم أضف الأصناف داخله.</Text>
        </View>
      )}

      {restaurant.categories.map((c) => {
        const products = restaurant.products
          .filter((p) => p.categoryId === c.id)
          .sort((a, b) => a.order - b.order);
        return (
          <View key={c.id} style={styles.catBlock}>
            <View style={styles.catHead}>
              <Text style={styles.catHeading}>
                {c.name} <Text style={styles.catCode}>({c.code})</Text>
              </Text>
              <Button
                label="صنف"
                variant="ghost"
                onPress={() => openAddProduct(c.id)}
                icon={<Ionicons name="add" size={14} color={colors.inkSoft} />}
              />
            </View>
            {products.length === 0 ? (
              <Text style={styles.emptyText}>لا أصناف في هذا التصنيف بعد.</Text>
            ) : (
              products.map((p, i) => (
                <View key={p.id} style={styles.mgmtRow}>
                  <View style={styles.reorderCol}>
                    <Pressable
                      disabled={i === 0}
                      onPress={() => mutate((c2) => reorderProduct(c2, restaurant.id, p.id, -1))}
                      style={styles.reorderBtn}
                    >
                      <Ionicons name="chevron-up" size={12} color={i === 0 ? colors.line : colors.inkSoft} />
                    </Pressable>
                    <Pressable
                      disabled={i === products.length - 1}
                      onPress={() => mutate((c2) => reorderProduct(c2, restaurant.id, p.id, 1))}
                      style={styles.reorderBtn}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={12}
                        color={i === products.length - 1 ? colors.line : colors.inkSoft}
                      />
                    </Pressable>
                  </View>
                  <CodeChip code={p.code} />
                  <View style={styles.mgmtBody}>
                    <Text style={styles.mgmtName}>{p.name}</Text>
                    <Text style={styles.mgmtSub}>
                      {formatPrice(p.price)}
                      {!p.available ? ' · غير متوفر' : ''}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      mutate((c2) => updateProduct(c2, restaurant.id, p.id, { available: !p.available }))
                    }
                    style={styles.smallBtn}
                  >
                    <Text style={styles.smallBtnText}>{p.available ? 'إخفاء' : 'إظهار'}</Text>
                  </Pressable>
                  <Pressable onPress={() => openEditProduct(p)} style={styles.smallBtn}>
                    <Text style={styles.smallBtnText}>تعديل</Text>
                  </Pressable>
                  <Pressable onPress={() => confirmDelete(p)} hitSlop={6}>
                    <Ionicons name="trash-outline" size={18} color={colors.inkSoft} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        );
      })}

      <ProductFormModal
        visible={formOpen}
        categories={restaurant.categories}
        product={editingProduct}
        defaultCategoryId={formCategoryId}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headRow: { flexDirection: 'row', alignItems: 'flex-start' },
  sectionTitle: { fontFamily: fontFamily.arabicBold, fontSize: 15, color: colors.ink },
  sectionSub: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  addCatRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.lg },
  addCatInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fontFamily.arabic,
    fontSize: 13.5,
    color: colors.ink,
    textAlign: 'right',
  },
  addCatBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { paddingVertical: 20, alignItems: 'center' },
  emptyTitle: { fontFamily: fontFamily.arabicSemiBold, fontSize: 14, color: colors.inkSoft },
  emptyText: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkFaint, marginTop: 4 },
  catBlock: { marginBottom: spacing.lg },
  catHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  catHeading: { fontFamily: fontFamily.arabicBold, fontSize: 14, color: colors.ink },
  catCode: { fontFamily: fontFamily.mono, fontSize: 11, color: colors.inkFaint, writingDirection: 'ltr' },
  mgmtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexWrap: 'wrap',
  },
  reorderCol: { gap: 2 },
  reorderBtn: {
    width: 22,
    height: 18,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mgmtBody: { flex: 1, minWidth: 90 },
  mgmtName: { fontFamily: fontFamily.arabic, fontSize: 14, color: colors.ink },
  mgmtSub: { fontFamily: fontFamily.mono, fontSize: 11, color: colors.inkFaint, writingDirection: 'ltr' },
  smallBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallBtnText: { fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkSoft },
});
