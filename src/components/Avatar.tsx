// bt:ec52ad88d4b0903b
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontFamily } from '../theme';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

export function Avatar({ name, hue, size = 52 }: { name: string; hue: number; size?: number }) {
  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: `hsl(${hue}, 58%, 46%)`,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.32 }]}>{initials(name).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontFamily: fontFamily.mono, writingDirection: 'ltr' },
});
