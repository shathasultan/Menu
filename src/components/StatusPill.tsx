// bt:ec52ad88d4b0903b
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '../theme';

export function StatusPill({ status }: { status: 'open' | 'closed' }) {
  const isOpen = status === 'open';
  return (
    <View style={[styles.pill, { backgroundColor: isOpen ? colors.goodSoft : colors.badSoft }]}>
      <View style={[styles.dot, { backgroundColor: isOpen ? colors.goodInk : colors.bad }]} />
      <Text style={[styles.text, { color: isOpen ? colors.goodInk : colors.bad }]}>
        {isOpen ? 'مفتوح الآن' : 'مغلق حاليًا'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontFamily: fontFamily.arabicSemiBold, fontSize: 11.5 },
});
