import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { brandColors, brandFont } from './theme';

const TINTS = [brandColors.accent100, brandColors.sage100, brandColors.accent200, brandColors.sage200];
const TEXT_TINTS = [brandColors.accent800, brandColors.sage800, brandColors.accent900, brandColors.sage900];

function hashIndex(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % mod;
}

export function VenueLogo({ name, seed, size = 78, radius = 22 }: { name: string; seed: string; size?: number; radius?: number }) {
  const idx = hashIndex(seed, TINTS.length);
  const initial = (name || '؟').trim().charAt(0).toUpperCase();
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderRadius: radius, backgroundColor: TINTS[idx] },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.34, color: TEXT_TINTS[idx] }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: brandFont.arExtraBold },
});
