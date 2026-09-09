// bt:ec52ad88d4b0903b
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, spacing } from '../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'accent' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'accent',
  icon,
  disabled,
  loading,
  fullWidth,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'accent' && styles.accent,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={variant === 'accent' ? colors.accentInk : colors.ink} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.label,
                variant === 'accent' && styles.labelAccent,
                variant === 'danger' && styles.labelDanger,
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fullWidth: { width: '100%' },
  accent: { backgroundColor: colors.accent },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line },
  danger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.badSoft },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fontFamily.arabicSemiBold, fontSize: 14.5, color: colors.inkSoft },
  labelAccent: { color: colors.accentInk },
  labelDanger: { color: colors.bad },
});
