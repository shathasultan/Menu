import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { brandColors, brandFont, brandShadow } from '../../../brand/theme';
import type { Venue } from '../../../firebase/types';
import { updateVenueInfo } from '../../../firebase/venueService';

export function VenueTab({ venue, onSaved }: { venue: Venue; onSaved: () => void }) {
  const [name, setName] = useState(venue.name);
  const [type, setType] = useState(venue.type);
  const [phone, setPhone] = useState(venue.phone);
  const [address, setAddress] = useState(venue.address);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateVenueInfo(venue.id, { name: name.trim(), type: type.trim(), phone: phone.trim(), address: address.trim() });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const approved = venue.status === 'approved';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.statusCard, approved ? styles.statusApproved : styles.statusPending]}>
        <Text style={[styles.statusTitle, { color: approved ? brandColors.sage900 : brandColors.accent900 }]}>
          {approved ? 'متجرك منشور للعملاء' : 'الطلب تحت المراجعة'}
        </Text>
        <Text style={styles.statusNote}>
          {approved
            ? 'تصل تعديلات الأسعار والتوفّر إلى العملاء لحظيًا.'
            : 'تراجع الإدارة بياناتك، والرد عادةً خلال يوم عمل.'}
        </Text>
      </View>

      <Text style={styles.heading}>بيانات المتجر</Text>
      <Text style={styles.sub}>متجر واحد لكل حساب. يظهر الشعار للعملاء في الصفحة الرئيسية وأعلى القائمة.</Text>

      <View style={styles.logoRow}>
        <View style={styles.logoSlot} />
        <Text style={styles.logoHelp}>اسحب الشعار هنا أو اضغط للاختيار. يفضّل استخدام صورة مربعة وواضحة.</Text>
      </View>

      <View style={styles.fields}>
        <Field label="اسم المتجر">
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="مثال: كشك السنابل" placeholderTextColor={brandColors.ink40} />
        </Field>
        <Field label="نوع النشاط">
          <TextInput value={type} onChangeText={setType} style={styles.input} placeholder="كشك قهوة، مطعم سريع..." placeholderTextColor={brandColors.ink40} />
        </Field>
        <Field label="جوال المتجر">
          <TextInput value={phone} onChangeText={setPhone} style={[styles.input, styles.ltr]} placeholder="05xxxxxxxx" placeholderTextColor={brandColors.ink40} keyboardType="phone-pad" />
        </Field>
        <Field label="العنوان">
          <TextInput value={address} onChangeText={setAddress} style={styles.input} placeholder="الحي، المدينة" placeholderTextColor={brandColors.ink40} />
        </Field>
      </View>

      <Pressable onPress={handleSave} disabled={saving} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }, saving && { opacity: 0.6 }]}>
        <Text style={styles.ctaText}>حفظ بيانات المتجر</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  statusCard: { borderRadius: 22, paddingHorizontal: 17, paddingVertical: 15, marginBottom: 18, ...brandShadow.card },
  statusPending: { backgroundColor: brandColors.accent100 },
  statusApproved: { backgroundColor: brandColors.sage100 },
  statusTitle: { fontFamily: brandFont.arExtraBold, fontSize: 14.5 },
  statusNote: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink55, marginTop: 4, lineHeight: 18 },
  heading: { fontFamily: brandFont.arExtraBold, fontSize: 16, color: brandColors.text },
  sub: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink55, marginTop: 4, marginBottom: 18, lineHeight: 19 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  logoSlot: { width: 96, height: 96, borderRadius: 26, backgroundColor: brandColors.sage100 },
  logoHelp: { flex: 1, fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink55, lineHeight: 19 },
  fields: { marginBottom: 18 },
  label: { fontFamily: brandFont.arBold, fontSize: 11.5, color: brandColors.ink50, marginBottom: 5, marginHorizontal: 4 },
  input: {
    borderWidth: 1,
    borderColor: brandColors.border12,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 17,
    paddingVertical: 13,
    fontFamily: brandFont.arRegular,
    fontSize: 14,
    color: brandColors.text,
    textAlign: 'right',
  },
  ltr: { writingDirection: 'ltr', fontFamily: brandFont.enRegular },
  cta: { backgroundColor: brandColors.sage, borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  ctaText: { fontFamily: brandFont.arExtraBold, fontSize: 15, color: '#fff' },
});
