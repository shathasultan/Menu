import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { brandColors, brandFont } from './theme';

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.pill}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 92,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: brandColors.text,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  text: { fontFamily: brandFont.arBold, fontSize: 12.5, color: '#fff' },
});
