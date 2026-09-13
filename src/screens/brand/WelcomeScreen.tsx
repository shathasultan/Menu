import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont, brandShadow } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const POINTS = [
  'تصفّح المطاعم والمقاهي القريبة بقوائم محدّثة لحظيًا.',
  'ابحث بالرمز، مثل A01 أو B03، بدلًا من الأسماء الطويلة.',
  'لديك متجر؟ سجّل حسابك، وأضف قائمتك، وانشرها بعد اعتماد الإدارة.',
];

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.decorA} />
      <View style={styles.decorB} />
      <Mascot variant="default" size={150} />

      <View style={styles.content}>
        <Text style={styles.wordmark}>
          menu<Text style={{ color: brandColors.accent }}>.</Text>
        </Text>
        <Text style={styles.title}>أهلًا بك في menu</Text>
        <Text style={styles.body}>
          قوائم المطاعم كلها في مكان واحد، ولكل منتج رمز ثابت يختصر الطلب: اطلب{' '}
          <Text style={styles.bodyBold}>B03</Text> بدلًا من الاسم الطويل.
        </Text>

        <View style={styles.points}>
          {POINTS.map((p, i) => (
            <View key={i} style={styles.pointRow}>
              <View style={styles.pointBadge}>
                <Text style={styles.pointNum}>{i + 1}</Text>
              </View>
              <Text style={styles.pointText}>{p}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => navigation.navigate('Role')}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.ctaText}>ابدأ الآن</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('AdminLogin')} style={{ alignSelf: 'center', marginTop: 14 }}>
          <Text style={styles.adminLink}>دخول الإدارة</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 22, justifyContent: 'flex-end', overflow: 'hidden' },
  decorA: { position: 'absolute', top: -120, right: -90, width: 300, height: 300, borderRadius: 999, backgroundColor: brandColors.accent100 },
  decorB: { position: 'absolute', top: 104, left: -70, width: 170, height: 170, borderRadius: 999, backgroundColor: brandColors.sage100 },
  content: {},
  wordmark: { fontFamily: brandFont.enExtraBold, fontSize: 30, color: brandColors.text, writingDirection: 'ltr', textAlign: 'right', marginBottom: 16 },
  title: { fontFamily: brandFont.arExtraBold, fontSize: 30, color: brandColors.text, marginBottom: 10, lineHeight: 40 },
  body: { fontFamily: brandFont.arRegular, fontSize: 14, color: brandColors.ink55, lineHeight: 26, marginBottom: 26 },
  bodyBold: { fontFamily: brandFont.enExtraBold, color: brandColors.accent800, writingDirection: 'ltr' },
  points: { gap: 11, marginBottom: 26 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  pointBadge: { width: 30, height: 30, borderRadius: 999, backgroundColor: brandColors.accent100, alignItems: 'center', justifyContent: 'center' },
  pointNum: { fontFamily: brandFont.enExtraBold, fontSize: 12, color: brandColors.accent800 },
  pointText: { flex: 1, fontFamily: brandFont.arRegular, fontSize: 13, color: 'rgba(32,30,29,0.7)', lineHeight: 21, marginTop: 4 },
  cta: { backgroundColor: brandColors.accent, borderRadius: 999, paddingVertical: 16, alignItems: 'center', ...brandShadow.cta },
  ctaText: { fontFamily: brandFont.arExtraBold, fontSize: 15.5, color: '#fff' },
  adminLink: { fontFamily: brandFont.arBold, fontSize: 12, color: brandColors.ink42 },
});
