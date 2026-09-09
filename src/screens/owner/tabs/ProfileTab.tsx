// bt:ec52ad88d4b0903b
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Restaurant } from '../../../types';
import { colors, fontFamily, radius, spacing } from '../../../theme';
import { Button } from '../../../components/Button';
import { useData } from '../../../data/DataContext';
import { updateRestaurant } from '../../../data/repo';

export function ProfileTab({ restaurant }: { restaurant: Restaurant }) {
  const { mutate } = useData();
  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [type, setType] = useState(restaurant.type);
  const [contact, setContact] = useState(restaurant.contact);
  const [location, setLocation] = useState(restaurant.location);
  const [hours, setHours] = useState(restaurant.hours);
  const [description, setDescription] = useState(restaurant.description);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(restaurant.name);
    setTagline(restaurant.tagline);
    setType(restaurant.type);
    setContact(restaurant.contact);
    setLocation(restaurant.location);
    setHours(restaurant.hours);
    setDescription(restaurant.description);
  }, [restaurant.id]);

  const handleSave = () => {
    mutate((current) =>
      updateRestaurant(current, restaurant.id, {
        name: name.trim() || restaurant.name,
        tagline: tagline.trim(),
        type: type.trim(),
        contact: contact.trim(),
        location: location.trim(),
        hours: hours.trim(),
        description: description.trim(),
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>الملف الشخصي للمطعم</Text>
      <Text style={styles.sectionSub}>هذه المعلومات تظهر أعلى صفحة المطعم للعملاء.</Text>

      <Field label="اسم المطعم" value={name} onChangeText={setName} />
      <Field label="وصف قصير" value={tagline} onChangeText={setTagline} />
      <View style={styles.row}>
        <Field label="النوع" value={type} onChangeText={setType} style={{ flex: 1 }} />
        <Field label="التواصل" value={contact} onChangeText={setContact} style={{ flex: 1 }} />
      </View>
      <View style={styles.row}>
        <Field label="الموقع" value={location} onChangeText={setLocation} style={{ flex: 1 }} />
        <Field label="ساعات العمل" value={hours} onChangeText={setHours} style={{ flex: 1 }} />
      </View>
      <Field
        label="وصف المطعم"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button label={saved ? 'تم الحفظ' : 'حفظ التغييرات'} onPress={handleSave} />
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  multiline,
  style,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  style?: object;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { fontFamily: fontFamily.arabicBold, fontSize: 15, color: colors.ink },
  sectionSub: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft, marginTop: 4, marginBottom: 14 },
  row: { flexDirection: 'row', gap: spacing.sm },
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
  textarea: { minHeight: 70, textAlignVertical: 'top' },
});
