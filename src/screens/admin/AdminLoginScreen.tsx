import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { auth } from '../../firebase/config';
import { fetchUserProfile, signOutUser } from '../../firebase/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminLogin'>;

export function AdminLoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!password) {
      setError('الرجاء إدخال كلمة المرور.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const profile = await fetchUserProfile(cred.user.uid);
      if (profile?.role !== 'admin') {
        await signOutUser();
        setError('هذا البريد لا يملك صلاحية الإدارة.');
        return;
      }
      navigation.replace('AdminHome');
    } catch {
      setError('البريد أو كلمة المرور غير صحيحة.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.decorCircle} />

      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </Pressable>

      <View style={styles.brandRow}>
        <Text style={styles.wordmark}>
          menu<Text style={{ color: brandColors.accent }}>.</Text>
        </Text>
        <Text style={styles.brandSub}>الإدارة</Text>
      </View>

      <Text style={styles.title}>لوحة الأدمن</Text>
      <Text style={styles.subtitle}>الدخول مخصص لبريد الإدارة، ومنه تُعتمد طلبات المطاعم.</Text>

      <View style={styles.fields}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="بريد الإدارة"
          placeholderTextColor={brandColors.white55}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="كلمة المرور"
          placeholderTextColor={brandColors.white55}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        onPress={handleLogin}
        disabled={submitting}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed, submitting && styles.ctaDisabled]}
      >
        <Text style={styles.ctaText}>دخول</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: brandColors.adminBg, padding: 22, paddingTop: 60 },
  decorCircle: {
    position: 'absolute',
    bottom: -90,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brandColors.white18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  brandRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 22 },
  wordmark: { fontFamily: brandFont.enExtraBold, fontSize: 26, color: '#fff' },
  brandSub: { fontFamily: brandFont.arBold, fontSize: 12, color: brandColors.white60 },
  title: { fontFamily: brandFont.arExtraBold, fontSize: 25, color: '#fff', marginBottom: 8 },
  subtitle: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.white55, lineHeight: 20, marginBottom: 26 },
  fields: { gap: 10, marginBottom: 12 },
  input: {
    backgroundColor: brandColors.white06,
    borderWidth: 1,
    borderColor: brandColors.white18,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: '#fff',
    fontFamily: brandFont.enRegular,
    fontSize: 14,
    textAlign: 'right',
  },
  errorText: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.accent300, marginBottom: 14 },
  cta: {
    backgroundColor: brandColors.accent,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  ctaPressed: { opacity: 0.9 },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { fontFamily: brandFont.arExtraBold, fontSize: 15, color: '#fff' },
});
