// bt:ec52ad88d4b0903b
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '../theme';

export function CodeChip({ code, large }: { code: string; large?: boolean }) {
  return (
    <View style={[styles.chip, large && styles.chipLarge]}>
      <Text style={[styles.text, large && styles.textLarge]}>{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 5,
    minWidth: 40,
    alignItems: 'center',
  },
  chipLarge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    fontFamily: fontFamily.mono,
    color: colors.accentStrong,
    fontSize: 13.5,
    writingDirection: 'ltr',
  },
  textLarge: {
    fontSize: 20,
  },
});
