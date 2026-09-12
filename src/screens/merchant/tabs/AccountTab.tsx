import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { brandColors, brandFont } from '../../../brand/theme';
import type { UserProfile } from '../../../firebase/types';
import { auth, db } from '../../../firebase/config';
import { signOutUser } from '../../../firebase/authService';

export function AccountTab({ profile, onToast }: { profile: UserProfile; onToast: (msg: string) => void }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initial = (profile.name || profile.email || '؟').trim().charAt(0).toUpperCase();

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), { name: name.trim(), phone: phone.trim() });
      if (password && profile.via === 'email' && auth.currentUser) {
        if (password.length < 8) {
          setError('كلمة المرور قصيرة جدًا.');
          setSaving(false);
          return;
        }
        await updatePassword(auth.currentUser, password);
        setPassword('');
      }
      onToast('تم حفظ بياناتك');
    } catch {
      setError('تعذّر حفظ التعديلات. قد تحتاجين إعادة تسجيل الدخول لتغيير كلمة المرور.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>
        <View style={styles.providerBadge}>
          <Text style={styles.providerText}>{profile.via === 'google' ? 'Google' : 'بالبريد'}</Text>
        </View>
      </View>

      <Text style={styles.heading}>بياناتي</Text>

      <View style={styles.fields}>
        <Field label="الاسم">
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={brandColors.ink40} />
        </Field>
        <Field label="البريد الإلكتروني">
          <TextInput value={profile.email} editable={false} style={[styles.input, styles.ltr, styles.inputDisabled]} />
        </Field>
        <Field label="رقم الجوال">
          <TextInput value={phone} onChangeText={setPhone} style={[styles.input, styles.ltr]} keyboardType="phone-pad" placeholder="05xxxxxxxx" placeholderTextColor={brandColors.ink40} />
        </Field>
        {profile.via === 'email' && (
          <Field label="كلمة المرور">
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.input, styles.ltr, styles.passwordInput]}
                placeholder="اتركيها فارغة إن لم ترغبي بتغييرها"
                placeholderTextColor={brandColors.ink40}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.showToggle}>
                <Text style={styles.showToggleText}>{showPassword ? 'إخفاء' : 'إظهار'}</Text>
              </Pressable>
            </View>
          </Field>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable onPress={handleSave} disabled={saving} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }, saving && { opacity: 0.6 }]}>
        <Text style={styles.ctaText}>حفظ التعديلات</Text>
      </Pressable>

      <Pressable onPress={signOutUser} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: brandColors.sage100,
    borderRadius: 24,
    padding: 16,
    marginBottom: 22,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: brandFont.enExtraBold, fontSize: 20, color: brandColors.sage800 },
  profileName: { fontFamily: brandFont.arExtraBold, fontSize: 16, color: brandColors.text },
  profileEmail: { fontFamily: brandFont.enRegular, fontSize: 11.5, color: brandColors.ink55, writingDirection: 'ltr', marginTop: 2 },
  providerBadge: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  providerText: { fontFamily: brandFont.enBold, fontSize: 10.5, color: brandColors.text },
  heading: { fontFamily: brandFont.arExtraBold, fontSize: 16, color: brandColors.text, marginBottom: 14 },
  fields: { marginBottom: 6 },
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
  inputDisabled: { opacity: 0.55 },
  ltr: { writingDirection: 'ltr', fontFamily: brandFont.enRegular },
  passwordRow: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingLeft: 60 },
  showToggle: { position: 'absolute', left: 14 },
  showToggleText: { fontFamily: brandFont.arBold, fontSize: 11, color: brandColors.accent800 },
  errorText: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.accent800, marginBottom: 12, lineHeight: 18 },
  cta: { backgroundColor: brandColors.sage, borderRadius: 999, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  ctaText: { fontFamily: brandFont.arExtraBold, fontSize: 15, color: '#fff' },
  logoutBtn: { borderWidth: 1, borderColor: brandColors.border12, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  logoutText: { fontFamily: brandFont.arBold, fontSize: 14.5, color: brandColors.ink70 },
});
