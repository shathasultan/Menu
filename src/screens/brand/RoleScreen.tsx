import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont, brandShadow } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { useAuth } from '../../firebase/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Role'>;

export function RoleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { firebaseUser } = useAuth();

  const handleMerchant = () => {
    if (firebaseUser) {
      navigation.navigate('OwnerHome');
    } else {
      navigation.navigate('MerchantAuth');
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 27, paddingBottom: insets.bottom + 30 }]}>
      <View style={styles.decor} />

      <Text style={styles.wordmark}>
        menu<Text style={{ color: brandColors.accent }}>.</Text>
      </Text>
      <Text style={styles.title}>كيف تحب تستخدم menu؟</Text>
      <Text style={styles.sub}>اختر الوضع المناسب لك، ويمكنك تغييره في أي وقت.</Text>

      <View style={styles.cards}>
        <Pressable
          onPress={() => navigation.navigate('Main')}
          style={({ pressed }) => [styles.card, styles.cardCustomer, pressed && styles.cardPressed]}
        >
          <Mascot variant="calm" size={70} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>تصفّح القوائم</Text>
            <Text style={styles.cardSub}>استعرض المطاعم، وابحث بالرمز، واحفظ اختياراتك المفضلة.</Text>
          </View>
          <View style={[styles.chevronCircle, { backgroundColor: brandColors.accent }]}>
            <Ionicons name="chevron-back" size={17} color="#fff" />
          </View>
        </Pressable>

        <Pressable
          onPress={handleMerchant}
          style={({ pressed }) => [styles.card, styles.cardMerchant, pressed && styles.cardPressed]}
        >
          <Mascot variant="apron" size={70} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>لدي متجر</Text>
            <Text style={styles.cardSub}>أضف تصنيفاتك ومنتجاتك، وتُنشأ الرموز تلقائيًا.</Text>
          </View>
          <View style={[styles.chevronCircle, { backgroundColor: brandColors.sage }]}>
            <Ionicons name="chevron-back" size={17} color="#fff" />
          </View>
        </Pressable>
      </View>

      <Text style={[styles.footnote, { bottom: insets.bottom + 16 }]}>
        التصفّح متاح دون تسجيل، والتسجيل مطلوب لأصحاب المتاجر فقط.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 22, overflow: 'hidden' },
  decor: { position: 'absolute', top: -110, left: -80, width: 240, height: 240, borderRadius: 999, backgroundColor: brandColors.accent100 },
  wordmark: { fontFamily: brandFont.enExtraBold, fontSize: 26, color: brandColors.text, writingDirection: 'ltr' },
  title: { fontFamily: brandFont.arExtraBold, fontSize: 27, color: brandColors.text, marginTop: 18, marginBottom: 6, lineHeight: 36 },
  sub: { fontFamily: brandFont.arRegular, fontSize: 13.5, color: brandColors.ink55, lineHeight: 22, marginBottom: 24 },
  cards: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: '#fff',
    borderWidth: 1.5,
  },
  cardCustomer: { borderColor: brandColors.accent300, ...brandShadow.roleCardAccent },
  cardMerchant: { borderColor: brandColors.sage300, ...brandShadow.roleCardSage },
  cardPressed: { opacity: 0.92 },
  cardTitle: { fontFamily: brandFont.arExtraBold, fontSize: 19, color: brandColors.text },
  cardSub: { fontFamily: brandFont.arRegular, fontSize: 12.5, color: brandColors.ink55, marginTop: 4, lineHeight: 19 },
  chevronCircle: { width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  footnote: {
    position: 'absolute',
    left: 22,
    right: 22,
    textAlign: 'center',
    fontFamily: brandFont.arRegular,
    fontSize: 11.5,
    color: brandColors.ink40,
    lineHeight: 18,
  },
});
