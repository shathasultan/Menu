// bt:ec52ad88d4b0903b
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useData } from '../../data/DataContext';
import { createRestaurant } from '../../data/repo';
import { colors, fontFamily, radius, shadow, spacing } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'OwnerLogin'>;

export function OwnerLoginScreen({ navigation }: Props) {
  const { db, mutate } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [tagline, setTagline] = useState('');

  if (!db) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    let newSlug = '';
    await mutate((current) => {
      const { db: nextDb, restaurant } = createRestaurant(current, { name, type, tagline });
      newSlug = restaurant.slug;
      return nextDb;
    });
    setModalOpen(false);
    setName('');
    setType('');
    setTagline('');
    if (newSlug) navigation.replace('OwnerDashboard', { slug: newSlug });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.noteStrip}>
          <Text style={styles.noteText}>
            دخول تجريبي بلا كلمة مرور حقيقية. سيُستبدل بنظام دخول فعلي عند ربط المنصة بخادم.
          </Text>
        </View>

        <Text style={styles.title}>اختر مطعمك للمتابعة</Text>

        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          {db.restaurants.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => navigation.navigate('OwnerDashboard', { slug: r.slug })}
              style={({ pressed }) => [styles.pickRow, pressed && styles.pickRowPressed]}
            >
              <Avatar name={r.name} hue={r.hue} />
              <View>
                <Text style={styles.pickName}>{r.name}</Text>
                <Text style={styles.pickType}>{r.type}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>أو</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          label="إنشاء مطعم تجريبي جديد"
          onPress={() => setModalOpen(true)}
          icon={<Ionicons name="add" size={16} color={colors.accentInk} />}
          fullWidth
        />
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalOpen(false)} />
          <View style={styles.sheet}>
            <Pressable onPress={() => setModalOpen(false)} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={18} color={colors.inkSoft} />
            </Pressable>
            <Text style={styles.sheetTitle}>إنشاء مطعم تجريبي</Text>
            <View style={styles.field}>
              <Text style={styles.label}>اسم المطعم</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="مثال: كشك السنابل"
                placeholderTextColor={colors.inkFaint}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>النوع</Text>
              <TextInput
                value={type}
                onChangeText={setType}
                placeholder="كشك قهوة، مطعم سريع..."
                placeholderTextColor={colors.inkFaint}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>وصف قصير</Text>
              <TextInput
                value={tagline}
                onChangeText={setTagline}
                placeholder="سطر واحد يعرّف بالمطعم"
                placeholderTextColor={colors.inkFaint}
                style={styles.input}
              />
            </View>
            <Button label="إنشاء والمتابعة للوحة التحكم" onPress={handleCreate} fullWidth />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  noteStrip: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 10,
    marginBottom: spacing.lg,
  },
  noteText: { fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkFaint },
  title: { fontFamily: fontFamily.arabicBold, fontSize: 18, color: colors.ink, textAlign: 'center' },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 12,
    ...shadow.soft,
  },
  pickRowPressed: { borderColor: colors.accent, opacity: 0.9, transform: [{ scale: 0.98 }] },
  pickName: { fontFamily: fontFamily.arabicBold, fontSize: 14.5, color: colors.ink },
  pickType: { fontFamily: fontFamily.arabic, fontSize: 12.5, color: colors.inkSoft },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkFaint },
  overlay: { flex: 1, backgroundColor: 'rgba(20,15,8,0.45)', justifyContent: 'flex-end' },
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
  sheetTitle: { fontFamily: fontFamily.arabicBold, fontSize: 16, color: colors.ink, marginBottom: 14 },
  field: { marginBottom: spacing.md },
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
});
