import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export default function CafeteriaCard({ cafeteria, onPress, imagem }) {
  const { nome, bairro, distancia, tempo, entrega, avaliacao, aberto } = cafeteria;
  const { isFavorito, adicionarFavorito } = useApp();
  const favoritoAtivo = isFavorito(cafeteria.id, 'cafeteria');

  function handleFavorito(e) {
    e.stopPropagation();
    adicionarFavorito(cafeteria, 'cafeteria');
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imgArea}>
        {imagem ? (
          <Image source={imagem} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={styles.imgPlaceholder}>
            <Text style={styles.imgIcon}>🏪</Text>
            <Text style={styles.imgTxt}>Foto cafeteria</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingTxt}>⭐ {avaliacao}</Text>
        </View>
        <View style={[styles.statusBadge, !aberto && styles.statusFechado]}>
          <Text style={styles.statusTxt}>{aberto ? '🟢 Aberto' : '🔴 Fechado'}</Text>
        </View>
        {/* Botão de favoritos*/}
        <TouchableOpacity style={styles.heartBtn} onPress={handleFavorito}>
          <Text style={styles.heartTxt}>{favoritoAtivo ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.nome}>{nome}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoTxt}>📍 {bairro}</Text>
          <Text style={styles.infoSep}>•</Text>
          <Text style={styles.infoTxt}>{distancia}</Text>
          <Text style={styles.infoSep}>•</Text>
          <Text style={styles.infoTxt}>~{tempo}</Text>
        </View>
        <View style={styles.tagsRow}>
          <View style={styles.tagEntrega}>
            <Text style={styles.tagEntregaTxt}>
              {entrega === '0' ? '🚀 Frete grátis' : `🛵 Entrega R$ ${entrega}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cream,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imgArea: { height: 110, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: {
    flex: 1,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgIcon: { fontSize: 28 },
  imgTxt: { fontSize: 10, color: colors.gray, marginTop: 2 },
  ratingBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  ratingTxt: { fontSize: 10, color: '#f7d96b' },
  statusBadge: {
    position: 'absolute', top: 8, left: 60,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  statusFechado: { backgroundColor: 'rgba(200,50,50,0.15)' },
  statusTxt: { fontSize: 10, fontWeight: '500' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 32, height: 32,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartTxt: { fontSize: 16 },
  body: { padding: 12 },
  nome: { fontSize: 15, fontWeight: 'bold', color: colors.dark, marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  infoTxt: { fontSize: 12, color: colors.gray },
  infoSep: { fontSize: 12, color: colors.border },
  tagsRow: { flexDirection: 'row' },
  tagEntrega: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10,
  },
  tagEntregaTxt: { fontSize: 11, color: colors.success, fontWeight: '500' },
});