// bt:ec52ad88d4b0903b
import React from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import type { Restaurant } from '../../../types';
import { colors, fontFamily, radius, spacing } from '../../../theme';
import { Button } from '../../../components/Button';

export function ShareTab({ restaurant }: { restaurant: Restaurant }) {
  const url = `https://menyu.app/r/${restaurant.slug}`;

  const copyLink = async () => {
    await Clipboard.setStringAsync(url);
  };

  const shareLink = async () => {
    try {
      await Share.share({ message: `منيو ${restaurant.name}: ${url}` });
    } catch {
      // cancelled
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>مشاركة المنيو</Text>
      <Text style={styles.sectionSub}>رابط ثابت لمنيو مطعمك، شاركه أو استخدمه في رمز QR.</Text>

      <View style={styles.linkBox}>
        <Text style={styles.linkText} numberOfLines={1}>
          {url}
        </Text>
        <Pressable onPress={copyLink} hitSlop={8}>
          <Ionicons name="copy-outline" size={18} color={colors.inkSoft} />
        </Pressable>
      </View>

      <View style={{ marginTop: spacing.md }}>
        <Button label="مشاركة الرابط" onPress={shareLink} />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>رمز QR</Text>
      <View style={styles.qrRow}>
        <View style={styles.qrBox}>
          <QRCode value={url} size={96} color={colors.ink} backgroundColor={colors.surface} />
        </View>
        <Text style={styles.qrHint}>
          رمز حقيقي قابل للمسح، على الطاولة أو الكاونتر أو التغليف. الرابط عنوان مبدئي حتى ننشر التطبيق على نطاق حقيقي.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { fontFamily: fontFamily.arabicBold, fontSize: 15, color: colors.ink },
  sectionSub: { fontFamily: fontFamily.arabic, fontSize: 13, color: colors.inkSoft, marginTop: 4, marginBottom: 12 },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  linkText: {
    flex: 1,
    fontFamily: fontFamily.mono,
    fontSize: 12,
    color: colors.inkSoft,
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  qrRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  qrBox: {
    width: 110,
    height: 110,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  qrHint: { flex: 1, fontFamily: fontFamily.arabic, fontSize: 12, color: colors.inkFaint },
});
