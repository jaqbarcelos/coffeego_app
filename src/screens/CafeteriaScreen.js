import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

// IMAGENS DAS CAFETERIAS
const IMAGENS = {
  'Aurora Café': require('../../assets/aurora_cafe.jpg'),
  'Bistro Paulista': require('../../assets/bistro_paulista.jpg'),
  'Café Moema': require('../../assets/cafe_moema.jpg'),
  'Vila Café': require('../../assets/vila_cafe.jpg'),
  'Jardins Coffee': require('../../assets/jardin_coffee.jpg'),
  'Itaim Coffee': require('../../assets/itaim_coffee.jpg'),
  'Paulista Expresso': require('../../assets/paulista_expresso.jpg'),
  'Santo Café': require('../../assets/santo_cafe.jpg'),
  'Lapa Café': require('../../assets/lapa_cafe.jpg'),
  'Mooca Coffee': require('../../assets/mooca_coffee.jpg'),
};

export default function CafeteriaScreen({ navigation, route }) {
  const { cafeteria } = route?.params || {
    cafeteria: {
      id: '1', nome: 'Aurora Café', bairro: 'Centro',
      distancia: '1.2 km', tempo: '25 min', entrega: '5',
      avaliacao: '4.9', aberto: true,
      descricao: 'O melhor café do centro de São Paulo, com grãos selecionados e ambiente aconchegante.',
    }
  };

  const { isFavorito, adicionarFavorito, toastFavoritoMsg } = useApp();
  const favoritoAtivo = isFavorito(cafeteria.id, 'cafeteria');
  const imagem = IMAGENS[cafeteria.nome];

  const HORARIOS = [
    { dia: 'Seg — Sex', hora: '07h — 19h' },
    { dia: 'Sábado', hora: '08h — 17h' },
    { dia: 'Domingo', hora: '09h — 14h' },
  ];

  return (
    <View style={styles.container}>
      {toastFavoritoMsg ? (
        <View style={styles.toast}>
          <Text style={styles.toastTxt}>❤️ {toastFavoritoMsg}</Text>
        </View>
      ) : null}

      <View style={styles.imgArea}>
        {imagem ? (
          <Image source={imagem} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={styles.imgPlaceholder}>
            <Text style={styles.imgIcon}>🏪</Text>
            <Text style={styles.imgTxt}>Foto da cafeteria</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack ? navigation.goBack() : null}
        >
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => adicionarFavorito(cafeteria, 'cafeteria')}
        >
          <Text style={styles.heartTxt}>{favoritoAtivo ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.nome}>{cafeteria.nome}</Text>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagTxt}>Café & Bistrô</Text>
          </View>
          <View style={[styles.tag, cafeteria.aberto ? styles.tagAberto : styles.tagFechado]}>
            <Text style={[styles.tagTxt, { color: cafeteria.aberto ? colors.success : colors.danger }]}>
              {cafeteria.aberto ? '🟢 Aberto agora' : '🔴 Fechado'}
            </Text>
          </View>
        </View>

        <Text style={styles.rating}>⭐ {cafeteria.avaliacao} (580 avaliações)</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcone}>📍</Text>
          <Text style={styles.infoTxt}>
            {cafeteria.bairro} — São Paulo, SP • {cafeteria.distancia}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcone}>⏱</Text>
          <Text style={styles.infoTxt}>Tempo estimado: ~{cafeteria.tempo}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcone}>🛵</Text>
          <Text style={styles.infoTxt}>
            {cafeteria.entrega === '0'
              ? 'Frete grátis 🎉'
              : `Entrega: R$ ${cafeteria.entrega},00`}
          </Text>
        </View>

        {cafeteria.descricao ? (
          <View style={styles.descricaoBox}>
            <Text style={styles.descricao}>{cafeteria.descricao}</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.secTitulo}>Horários de funcionamento</Text>
        <View style={styles.horariosCard}>
          {HORARIOS.map(({ dia, hora }) => (
            <View key={dia} style={styles.horarioRow}>
              <Text style={styles.horarioDia}>{dia}</Text>
              <Text style={styles.horarioHora}>{hora}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation?.navigate ? navigation.navigate('Cardapio') : null}
        >
          <Text style={styles.botaoTxt}>Ver cardápio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  toast: {
    position: 'absolute', top: 60, left: 20, right: 20,
    backgroundColor: colors.dark, borderRadius: 12,
    padding: 12, zIndex: 999, alignItems: 'center',
  },
  toastTxt: { color: colors.white, fontSize: 14 },
  imgArea: { height: 220, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: {
    flex: 1, backgroundColor: colors.lightGray,
    alignItems: 'center', justifyContent: 'center',
  },
  imgIcon: { fontSize: 48 },
  imgTxt: { fontSize: 12, color: colors.gray, marginTop: 4 },
  backBtn: {
    position: 'absolute', top: 12, left: 12,
    width: 34, height: 34,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  backTxt: { fontSize: 20, color: colors.medium },
  heartBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 34, height: 34,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  heartTxt: { fontSize: 18 },
  body: { flex: 1 },
  bodyContent: { padding: 20 },
  nome: { fontSize: 24, fontWeight: 'bold', color: colors.dark, marginBottom: 8 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tag: {
    backgroundColor: colors.lightGold,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  tagAberto: { backgroundColor: colors.successBg },
  tagFechado: { backgroundColor: '#fde8e8' },
  tagTxt: { fontSize: 12, fontWeight: 'bold', color: colors.dark },
  rating: { fontSize: 13, color: colors.gray, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  infoIcone: { fontSize: 14, marginTop: 1 },
  infoTxt: { fontSize: 13, color: colors.gray, flex: 1, lineHeight: 20 },
  descricaoBox: {
    backgroundColor: colors.lightGray, borderRadius: 10,
    padding: 12, marginTop: 8,
  },
  descricao: { fontSize: 14, color: colors.gray, lineHeight: 22 },
  divider: { height: 0.5, backgroundColor: colors.border, marginVertical: 16 },
  secTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.dark, marginBottom: 12 },
  horariosCard: { gap: 8 },
  horarioRow: { flexDirection: 'row', justifyContent: 'space-between' },
  horarioDia: { fontSize: 13, color: colors.gray },
  horarioHora: { fontSize: 13, fontWeight: '500', color: colors.dark },
  footer: {
    padding: 16, backgroundColor: colors.white,
    borderTopWidth: 0.5, borderColor: colors.border,
  },
  botao: {
    backgroundColor: colors.gold,
    borderRadius: 30, padding: 16, alignItems: 'center',
  },
  botaoTxt: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});