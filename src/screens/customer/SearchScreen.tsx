import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { brandColors, brandFont } from '../../brand/theme';
import { Mascot } from '../../brand/Mascot';
import { VenueLogo } from '../../brand/VenueLogo';
import { listenApprovedVenues } from '../../firebase/customerService';
import type { Venue } from '../../firebase/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function SearchScreen({ navigation }: Props) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => listenApprovedVenues(setVenues), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return venues.filter(
      (v) => v.name?.toLowerCase().includes(q) || v.type?.toLowerCase().includes(q)
    );
  }, [venues, query]);

  const suggestions = venues.slice(0, 4);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={brandColors.ink50} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="اكتب اسم المطعم أو النوع"
            placeholderTextColor={brandColors.ink40}
            style={styles.input}
            autoFocus
          />
        </View>
        <Text style={styles.resultLine}>
          {results === null ? 'اكتبي اسمًا أو اختاري من الاقتراحات' : `${results.length} نتيجة لـ«${query}»`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {results === null ? (
          <>
            <Text style={styles.sectionTitle}>اقتراحات</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {suggestions.map((v) => (
                <Pressable key={v.id} onPress={() => setQuery(v.name)} style={styles.suggestionChip}>
                  <Text style={styles.suggestionText}>{v.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <Mascot variant="calm" size={86} />
            <Text style={styles.emptyText}>لا توجد نتائج لهذا البحث.{'\n'}جرّبي اسم مطعم أو نوع نشاط مختلف.</Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {results.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => navigation.navigate('VenueDetail', { venueId: v.id })}
                style={styles.resultRow}
              >
                <VenueLogo name={v.name} seed={v.id} size={44} radius={14} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultName}>{v.name}</Text>
                  <Text style={styles.resultType}>{v.type}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: brandColors.chip06,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { flex: 1, fontFamily: brandFont.arRegular, fontSize: 14, color: brandColors.text, textAlign: 'right' },
  resultLine: { fontFamily: brandFont.arRegular, fontSize: 12, color: brandColors.ink50, marginTop: 10 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontFamily: brandFont.arBold, fontSize: 13, color: brandColors.ink55 },
  suggestionChip: { borderWidth: 1, borderColor: brandColors.border12, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, marginLeft: 8 },
  suggestionText: { fontFamily: brandFont.arBold, fontSize: 12.5, color: brandColors.text },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontFamily: brandFont.arRegular, fontSize: 13, color: brandColors.ink55, textAlign: 'center', lineHeight: 22 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: brandColors.chip06, paddingVertical: 12 },
  resultName: { fontFamily: brandFont.arBold, fontSize: 14, color: brandColors.text },
  resultType: { fontFamily: brandFont.arRegular, fontSize: 11.5, color: brandColors.ink55, marginTop: 2 },
});
