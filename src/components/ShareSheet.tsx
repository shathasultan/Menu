// bt:ec52ad88d4b0903b
import React from 'react';
import { Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { colors, fontFamily, radius, spacing } from '../theme';
import { Button } from './Button';

export function ShareSheet({
  visible,
  restaurantName,
  slug,
  onClose,
}: {
  visible: boolean;
  restaurantName: string;
  slug: string;
  onClose: () => void;
}) {
  const url = `https://menyu.app/r/${slug}`;

  const copyLink = async () => {
    await Clipboard.setStringAsync(url);
  };

  const shareLink = async () => {
    try {
      await Share.share({ message: `منيو ${restaurantName} على منصة منيو: ${url}` });
    } catch {
      // user cancelled or share unavailable, no action needed
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.inkSoft} />
          </Pressable>
          <Text style={styles.title}>مشاركة منيو {restaurantName}</Text>

          <View style={styles.qrBox}>
            <QRCode value={url} size={140} color={colors.ink} backgroundColor={colors.surface} />
          </View>
          <Text style={styles.hint}>
            رمز QR حقيقي، لكن الرابط عنوان مبدئي حتى ننشر التطبيق على نطاق حقيقي.
          </Text>

          <View style={styles.linkBox}>
            <Text style={styles.linkText} numberOfLines={1}>
              {url}
            </Text>
            <Pressable onPress={copyLink} hitSlop={8}>
              <Ionicons name="copy-outline" size={18} color={colors.inkSoft} />
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Button label="مشاركة" onPress={shareLink} fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(20,15,8,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
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
  title: { fontFamily: fontFamily.arabicBold, fontSize: 16, color: colors.ink, marginBottom: 16 },
  qrBox: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  hint: {
    fontFamily: fontFamily.arabic,
    fontSize: 11.5,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 240,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 18,
    width: '100%',
  },
  linkText: {
    flex: 1,
    fontFamily: fontFamily.mono,
    fontSize: 12,
    color: colors.inkSoft,
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  actions: { marginTop: 16, width: '100%' },
});
