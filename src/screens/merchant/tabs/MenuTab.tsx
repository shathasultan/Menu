import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFont, brandShadow } from '../../../brand/theme';
import type { VenueCategory, VenueProduct } from '../../../firebase/types';
import { addCategory, deleteProduct, listenCategories, listenProducts, updateProduct } from '../../../firebase/venueService';
import { ProductFormSheet } from '../ProductFormSheet';

export function MenuTab({ venueId, onToast }: { venueId: string; onToast: (msg: string) => void }) {
  const [categories, setCategories] = useState<VenueCategory[]>([]);
  const [products, setProducts] = useState<VenueProduct[]>([]);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VenueProduct | null>(null);

  useEffect(() => listenCategories(venueId, setCategories), [venueId]);
  useEffect(() => listenProducts(venueId, setProducts), [venueId]);

  useEffect(() => {
    if (!activeCatId && categories.length > 0) setActiveCatId(categories[0].id);
  }, [categories, activeCatId]);

  const activeCategory = categories.find((c) => c.id === activeCatId) ?? null;
  const catProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCatId).sort((a, b) => a.order - b.order),
    [products, activeCatId]
  );

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => !p.available).length;

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await addCategory(venueId, newCatName.trim());
    setNewCatName('');
  };

  const handleToggleAvailable = (p: VenueProduct) => {
    updateProduct(venueId, p.id, { available: !p.available });
  };

  const confirmDelete = (p: VenueProduct) => {
    Alert.alert('حذف الصنف', `حذف "${p.nameAr}" نهائيًا؟`, [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => deleteProduct(venueId, p.id).then(() => onToast('تم حذف الصنف')) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{totalProducts}</Text>
            <Text style={styles.statLabel}>إجمالي المنتجات</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{outOfStock}</Text>
            <Text style={styles.statLabel}>نفذت الكمية</Text>
          </View>
        </View>

        <View style={styles.addCatRow}>
          <TextInput
            value={newCatName}
            onChangeText={setNewCatName}
            placeholder="اسم تصنيف جديد"
            placeholderTextColor={brandColors.ink40}
            style={styles.addCatInput}
          />
          <Pressable onPress={handleAddCategory} style={styles.addCatBtn}>
            <Ionicons name="add" size={18} color="#fff" />
          </Pressable>
        </View>

        {categories.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>ابدأ بإضافة تصنيف</Text>
            <Text style={styles.emptyText}>مثل «مشروبات ساخنة» أو «سناكس»، ثم أضف الأصناف داخله.</Text>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c.id).length;
                const active = c.id === activeCatId;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setActiveCatId(c.id)}
                    style={[styles.catChip, active && styles.catChipActive]}
                  >
                    <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                      {c.letter} · {c.name} ({count})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>التصنيفات</Text>
              <Pressable
                onPress={() => {
                  if (!activeCategory) return;
                  setEditingProduct(null);
                  setFormOpen(true);
                }}
                style={styles.addProductBtn}
              >
                <Ionicons name="add" size={14} color="#fff" />
                <Text style={styles.addProductText}>أضف منتج</Text>
              </Pressable>
            </View>

            {catProducts.length === 0 ? (
              <Text style={styles.emptyText}>لا أصناف في هذا التصنيف بعد.</Text>
            ) : (
              <View style={{ gap: 10 }}>
                {catProducts.map((p) => (
                  <View key={p.id} style={[styles.productCard, !p.available && styles.productCardDim]}>
                    <View style={styles.productRow1}>
                      <View style={styles.imgSlot} />
                      <View style={styles.codeChip}>
                        <Text style={styles.codeChipText}>{p.code}</Text>
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.productName} numberOfLines={1}>{p.nameAr}</Text>
                        {!!p.nameEn && <Text style={styles.productNameEn} numberOfLines={1}>{p.nameEn}</Text>}
                      </View>
                      <Pressable onPress={() => handleToggleAvailable(p)} style={[styles.toggle, p.available && styles.toggleOn]}>
                        <View style={[styles.knob, p.available && styles.knobOn]} />
                      </Pressable>
                    </View>
                    <View style={styles.productRow2}>
                      <Text style={styles.priceLabel}>السعر</Text>
                      <PriceEditor venueId={venueId} product={p} />
                      <View style={{ flex: 1 }} />
                      <View style={[styles.stateTag, p.available ? styles.stateTagOn : styles.stateTagOff]}>
                        <Text style={[styles.stateTagText, { color: p.available ? brandColors.sage800 : brandColors.ink55 }]}>
                          {p.available ? 'متوفر' : 'نفذت الكمية'}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setEditingProduct(p);
                          setFormOpen(true);
                        }}
                        hitSlop={6}
                        style={{ marginRight: 4 }}
                      >
                        <Ionicons name="create-outline" size={17} color={brandColors.ink55} />
                      </Pressable>
                      <Pressable onPress={() => confirmDelete(p)} hitSlop={6} style={{ marginRight: 8 }}>
                        <Ionicons name="trash-outline" size={17} color={brandColors.ink55} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        <View style={styles.explainer}>
          <Text style={styles.explainerText}>
            يتكوّن الرمز تلقائيًا من حرف التصنيف مع أول رقم متاح، ويبقى ثابتًا دائمًا حتى لو تغيّر الاسم أو السعر.
          </Text>
        </View>
      </ScrollView>

      <ProductFormSheet
        visible={formOpen}
        venueId={venueId}
        categories={categories}
        defaultCategoryId={activeCatId}
        product={editingProduct}
        onClose={() => setFormOpen(false)}
        onSaved={(msg) => {
          setFormOpen(false);
          onToast(msg);
        }}
      />
    </View>
  );
}

function PriceEditor({ venueId, product }: { venueId: string; product: VenueProduct }) {
  const [text, setText] = useState(String(product.price));

  useEffect(() => setText(String(product.price)), [product.price]);

  const commit = () => {
    const digits = text.replace(/[^0-9]/g, '');
    const clamped = Math.max(0, Math.min(999, Number(digits) || 0));
    setText(String(clamped));
    if (clamped !== product.price) {
      updateProduct(venueId, product.id, { price: clamped });
    }
  };

  return (
    <View style={styles.priceInputWrap}>
      <TextInput
        value={text}
        onChangeText={(v) => setText(v.replace(/[^0-9]/g, ''))}
        onEndEditing={commit}
        keyboardType="number-pad"
        style={styles.priceInput}
      />
      <Text style={styles.priceUnit}>ر.س</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingVertical: 14, alignItems: 'center', ...brandShadow.card },
  statNum: { fontFamily: brandFont.enExtraBold, fontSize: 20, color: brandColors.text },
  statLabel: { fontFamily: brandFont.arRegular, fontSize: 11, color: brandColors.ink55, marginTop: 3 },
  addCatRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  addCatInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: brandColors.border12,
    borderRadius: 999,
    paddingHorizontal: 17,
    paddingVertical: 11,
    fontFamily: brandFont.arRegular,
    fontSize: 13.5,
    color: brandColors.text,
    textAlign: 'right',
  },
  addCatBtn: { width: 42, height: 42, borderRadius: 999, backgroundColor: brandColors.accent, alignItems: 'center', justifyContent: 'center' },
  empty: { paddingVertical: 24, alignItems: 'center' },
  emptyTitle: { fontFamily: brandFont.arBold, fontSize: 14, color: brandColors.ink55 },
  emptyText: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink40, marginTop: 4, textAlign: 'center' },
  catRow: { marginBottom: 14 },
  catChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: brandColors.border12,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginLeft: 8,
  },
  catChipActive: { backgroundColor: brandColors.text, borderColor: brandColors.text },
  catChipText: { fontFamily: brandFont.arBold, fontSize: 12.5, color: brandColors.ink55 },
  catChipTextActive: { color: '#fff' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontFamily: brandFont.arExtraBold, fontSize: 15, color: brandColors.text },
  addProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: brandColors.accent,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  addProductText: { fontFamily: brandFont.arBold, fontSize: 12.5, color: '#fff' },
  productCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: brandColors.border09,
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 14,
    ...brandShadow.card,
  },
  productCardDim: { opacity: 0.7 },
  productRow1: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  imgSlot: { width: 40, height: 40, borderRadius: 12, backgroundColor: brandColors.chip06 },
  codeChip: { backgroundColor: brandColors.accent100, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  codeChipText: { fontFamily: brandFont.enExtraBold, fontSize: 13, color: brandColors.accent800, writingDirection: 'ltr' },
  productName: { fontFamily: brandFont.arExtraBold, fontSize: 14, lineHeight: 18, color: brandColors.text },
  productNameEn: { fontFamily: brandFont.enRegular, fontSize: 10.5, color: brandColors.ink45, writingDirection: 'ltr', marginTop: 1 },
  toggle: { width: 40, height: 24, borderRadius: 999, backgroundColor: brandColors.chip06, padding: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: brandColors.sage },
  knob: { width: 18, height: 18, borderRadius: 999, backgroundColor: '#fff', alignSelf: 'flex-end' },
  knobOn: { alignSelf: 'flex-start' },
  productRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: brandColors.border08,
    gap: 6,
  },
  priceLabel: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink50 },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: brandColors.border12,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  priceInput: {
    width: 46,
    padding: 0,
    fontFamily: brandFont.enBold,
    fontSize: 15,
    color: brandColors.text,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
  priceUnit: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink50 },
  stateTag: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  stateTagOn: { backgroundColor: brandColors.sage100 },
  stateTagOff: { backgroundColor: brandColors.chip07 },
  stateTagText: { fontFamily: brandFont.arBold, fontSize: 10 },
  explainer: { backgroundColor: brandColors.accent100, borderRadius: 22, paddingHorizontal: 17, paddingVertical: 15, marginTop: 20 },
  explainerText: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.accent900, lineHeight: 20 },
});
