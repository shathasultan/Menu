import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont, brandRadius, brandShadow } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { GoogleGlyph } from '../../brand/GoogleGlyph';
import { signInMerchant, signUpMerchant } from '../../firebase/authService';
import { useGoogleAuth } from '../../firebase/useGoogleAuth';
import { useAuth } from '../../firebase/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MerchantAuth'>;

type Mode = 'login' | 'signup';

export function MerchantAuthScreen({ navigation }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const google = useGoogleAuth();
  const { firebaseUser } = useAuth();
  const navigatedRef = useRef(false);

  // Covers both the email/password path (signUpMerchant/signInMerchant below)
  // and the Google path (useGoogleAuth signs in internally with no callback) —
  // one place navigates onward the moment a session exists.
  useEffect(() => {
    if (firebaseUser && !navigatedRef.current) {
      navigatedRef.current = true;
      navigation.replace('OwnerHome', { justSignedIn: true });
    }
  }, [firebaseUser, navigation]);

  const validate = (): string | null => {
    if (!email.trim() || !email.includes('@')) return 'الرجاء إدخال بريد إلكتروني صحيح.';
    if (password.length < 8) return 'كلمة المرور قصيرة جدًا.';
    if (mode === 'signup' && !name.trim()) return 'الرجاء إدخال الاسم.';
    if (mode === 'signup' && phone.trim().length < 9) return 'الرجاء إدخال رقم جوال صحيح.';
    return null;
  };

  const handleSubmit = async () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUpMerchant({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      } else {
        await signInMerchant(email.trim(), password);
      }
      setPassword('');
      // Navigation happens in the firebaseUser effect above once the auth
      // state listener picks up the new session.
    } catch (e: any) {
      setError(mapAuthError(e?.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.decorCircle} />

      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
        <Ionicons name="chevron-forward" size={18} color={brandColors.text} />
      </Pressable>

      <View style={styles.headerRow}>
        <Mascot variant="apron" size={60} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب تاجر'}</Text>
          <Text style={styles.subtitle}>
            {mode === 'login' ? 'سجّل الدخول لمتابعة إدارة قائمتك.' : 'حساب واحد لكل متجر.'}
          </Text>
        </View>
      </View>

      <View style={styles.segment}>
        <Pressable
          onPress={() => {
            setMode('login');
            setError(null);
          }}
          style={[styles.segmentOpt, mode === 'login' && styles.segmentOptActive]}
        >
          <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>تسجيل دخول</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setMode('signup');
            setError(null);
          }}
          style={[styles.segmentOpt, mode === 'signup' && styles.segmentOptActive]}
        >
          <Text style={[styles.segmentText, mode === 'signup' && styles.segmentTextActive]}>حساب جديد</Text>
        </Pressable>
      </View>

      <View style={styles.fields}>
        {mode === 'signup' && (
          <Field label="الاسم">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="الاسم الكامل"
              placeholderTextColor={brandColors.ink40}
              style={styles.input}
            />
          </Field>
        )}
        <Field label="البريد الإلكتروني">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="name@shop.sa"
            placeholderTextColor={brandColors.ink40}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, styles.inputLtr]}
          />
        </Field>
        {mode === 'signup' && (
          <Field label="رقم الجوال">
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="05xxxxxxxx"
              placeholderTextColor={brandColors.ink40}
              keyboardType="phone-pad"
              style={[styles.input, styles.inputLtr]}
            />
          </Field>
        )}
        <Field label="كلمة المرور">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={mode === 'signup' ? '8 أحرف على الأقل' : ''}
            placeholderTextColor={brandColors.ink40}
            secureTextEntry
            style={[styles.input, styles.inputLtr]}
          />
        </Field>
      </View>

      {(error || google.error) && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error ?? google.error}</Text>
        </View>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed, submitting && styles.ctaDisabled]}
      >
        <Text style={styles.ctaText}>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>أو</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable
        onPress={google.promptGoogleSignIn}
        disabled={!google.ready || google.loading}
        style={({ pressed }) => [styles.googleBtn, pressed && styles.googleBtnPressed]}
      >
        <GoogleGlyph size={18} />
        <Text style={styles.googleText}>
          {google.loading ? 'جارٍ الدخول...' : 'المتابعة باستخدام Google'}
        </Text>
      </Pressable>

      <Text style={styles.footnote}>تراجع إدارة menu حسابك قبل ظهور متجرك للعملاء.</Text>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function mapAuthError(code?: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'هذا البريد مستخدم من قبل. جرّبي تسجيل الدخول بدل إنشاء حساب.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'البريد أو كلمة المرور غير صحيحة.';
    case 'auth/invalid-email':
      return 'الرجاء إدخال بريد إلكتروني صحيح.';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة جدًا.';
    case 'auth/network-request-failed':
      return 'تعذّر الاتصال بالخادم. تحققي من الإنترنت وحاولي مجددًا.';
    default:
      return 'حدث خطأ غير متوقع. حاولي مرة أخرى.';
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: brandColors.bg },
  content: { padding: 22, paddingTop: 54, paddingBottom: 34 },
  decorCircle: {
    position: 'absolute',
    top: -110,
    left: -80,
    width: 230,
    height: 230,
    borderRadius: 999,
    backgroundColor: brandColors.sage100,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brandColors.border12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 },
  headerText: { flex: 1 },
  title: { fontFamily: brandFont.arExtraBold, fontSize: 22, color: brandColors.text },
  subtitle: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55, marginTop: 4 },
  segment: {
    flexDirection: 'row',
    backgroundColor: brandColors.chip06,
    borderRadius: 999,
    padding: 5,
    marginBottom: 18,
  },
  segmentOpt: { flex: 1, paddingVertical: 9, borderRadius: 999, alignItems: 'center' },
  segmentOptActive: {
    backgroundColor: '#fff',
    shadowColor: '#201E1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  segmentText: { fontFamily: brandFont.arBold, fontSize: 13, color: brandColors.ink50 },
  segmentTextActive: { color: brandColors.text },
  fields: { gap: 10, marginBottom: 14 },
  field: {},
  label: { fontFamily: brandFont.arBold, fontSize: 11.5, color: brandColors.ink50, marginBottom: 6, marginHorizontal: 4 },
  input: {
    width: '100%',
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
  inputLtr: { textAlign: 'right', writingDirection: 'ltr', fontFamily: brandFont.enRegular },
  errorBanner: {
    backgroundColor: brandColors.accent100,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginBottom: 14,
  },
  errorText: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.accent900, lineHeight: 19 },
  cta: {
    backgroundColor: brandColors.sage,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    ...brandShadow.ctaSage,
  },
  ctaPressed: { opacity: 0.9 },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { fontFamily: brandFont.arExtraBold, fontSize: 15, color: '#fff' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: brandColors.border12 },
  dividerText: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink40 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: brandColors.border12,
    borderRadius: 999,
    paddingVertical: 14,
  },
  googleBtnPressed: { backgroundColor: brandColors.chip06 },
  googleText: { fontFamily: brandFont.arBold, fontSize: 14, color: brandColors.text },
  footnote: {
    fontFamily: brandFont.arRegular,
    fontSize: 11.5,
    color: brandColors.ink42,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 22,
  },
});
