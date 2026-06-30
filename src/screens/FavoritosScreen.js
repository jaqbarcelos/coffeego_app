import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function FavoritosScreen({ navigation }) {
  const [aba, setAba] = useState('Itens');
  const { favoritos, removerFavorito } = useApp();

  const favoritosItens = favoritos?.filter(f => f.tipo === 'item') || [];
  const favoritosCafeterias = favoritos?.filter(f => f.tipo === 'cafeteria') || [];

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {['Itens', 'Cafeterias'].map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, aba === a && styles.tabAtivo]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.tabTxt, aba === a && styles.tabTxtAtivo]}>
              {a === 'Itens' ? '☕ ' : '🏪 '}{a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {aba === 'Itens' ? (
          favoritosItens.length === 0 ? (
            <View style={styles.vazio}>
              <Text style={styles.vazioIcone}>🤍</Text>
              <Text style={styles.vazioTxt}>Nenhum item favorito ainda</Text>
              <Text style={styles.vazioSub}>Toque no ❤️ ao ver um produto para salvar aqui</Text>
            </View>
          ) : (
            favoritosItens.map((fav, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardImg}>
                  <Text style={{ fontSize: 24 }}>☕</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNome}>{fav.nome}</Text>
                  <Text style={styles.cardSub}>{fav.categoria}</Text>
                  <Text style={styles.cardPreco}>R$ {fav.preco}</Text>
                </View>
                <TouchableOpacity style={styles.removerBtn} onPress={() => removerFavorito(fav.id, 'item')}>
                  <Text style={styles.removerTxt}>❤️</Text>
                </TouchableOpacity>
              </View>
            ))
          )
        ) : (
          favoritosCafeterias.length === 0 ? (
            <View style={styles.vazio}>
              <Text style={styles.vazioIcone}>🤍</Text>
              <Text style={styles.vazioTxt}>Nenhuma cafeteria favorita ainda</Text>
              <Text style={styles.vazioSub}>Toque no ❤️ ao ver uma cafeteria para salvar aqui</Text>
            </View>
          ) : (
            favoritosCafeterias.map((fav, i) => (
              <View key={i} style={styles.card}>
                <View style={[styles.cardImg, { backgroundColor: colors.medium }]}>
                  <Text style={{ fontSize: 24 }}>🏪</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNome}>{fav.nome}</Text>
                  <Text style={styles.cardSub}>📍 {fav.bairro} • {fav.distancia}</Text>
                  <Text style={styles.cardPreco}>⭐ {fav.avaliacao}</Text>
                </View>
                <TouchableOpacity style={styles.removerBtn} onPress={() => removerFavorito(fav.id, 'cafeteria')}>
                  <Text style={styles.removerTxt}>❤️</Text>
                </TouchableOpacity>
              </View>
            ))
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  tabRow: { flexDirection: 'row', margin: 16, backgroundColor: colors.lightGray, borderRadius: 24, padding: 3 },
  tab: { flex: 1, padding: 10, borderRadius: 22, alignItems: 'center' },
  tabAtivo: { backgroundColor: colors.gold },
  tabTxt: { fontSize: 13, fontWeight: '500', color: colors.gray },
  tabTxtAtivo: { color: colors.white },
  scroll: { padding: 16, paddingBottom: 40 },
  vazio: { alignItems: 'center', paddingTop: 60 },
  vazioIcone: { fontSize: 48, marginBottom: 16 },
  vazioTxt: { fontSize: 16, fontWeight: '500', color: colors.gray },
  vazioSub: { fontSize: 13, color: colors.gray, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cream, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 12, marginBottom: 10 },
  cardImg: { width: 50, height: 50, borderRadius: 10, backgroundColor: colors.lightGray, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 14, fontWeight: 'bold', color: colors.dark },
  cardSub: { fontSize: 12, color: colors.gray, marginTop: 2 },
  cardPreco: { fontSize: 13, color: colors.gold, fontWeight: '600', marginTop: 3 },
  removerBtn: { padding: 8 },
  removerTxt: { fontSize: 20 },
});