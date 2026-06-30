import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const IMAGENS = {
  'Caffe Mocha': require('../../assets/caffe_mocha.jpg'),
  'Flat White': require('../../assets/flat_white.jpg'),
  'Latte Art': require('../../assets/latte_art.jpg'),
  'Machiato': require('../../assets/machiato.jpg'),
  'Americano': require('../../assets/americano.jpg'),
  'Cappuccino': require('../../assets/cappuccino.jpg'),
  'Cappuccino Clássico': require('../../assets/cappuccino.jpg'),
  'Cappuccino Gelado': require('../../assets/cappuccino.jpg'),
  'Espresso Simples': require('../../assets/americano.jpg'),
  'Ristretto': require('../../assets/americano.jpg'),
  'Cortado': require('../../assets/americano.jpg'),
  'Espresso Duplo': require('../../assets/americano.jpg'),
  'Cold Brew': require('../../assets/caffe_mocha.jpg'),
  'Frappuccino': require('../../assets/flat_white.jpg'),
  'Vanilla Latte': require('../../assets/latte_art.jpg'),
  'Caramel Latte': require('../../assets/latte_art.jpg'),
  'Caramel Machiato': require('../../assets/machiato.jpg'),
  'Machiato Clássico': require('../../assets/machiato.jpg'),
  'Vienna Coffee': require('../../assets/cappuccino.jpg'),
  'Americano Gelado': require('../../assets/americano.jpg'),
  'Café Tônica': require('../../assets/caffe_mocha.jpg'),
  'Chai Latte': require('../../assets/latte_art.jpg'),
  'Matcha Latte': require('../../assets/latte_art.jpg'),
};

const CAFETERIAS_POR_CATEGORIA = {
  'Espresso': [
    { nome: 'Aurora Cafe', bairro: 'Centro', distancia: '1.2 km', tempo: '25 min' },
    { nome: 'Jardins Coffee', bairro: 'Jardins', distancia: '3.1 km', tempo: '35 min' },
    { nome: 'Paulista Expresso', bairro: 'Bela Vista', distancia: '2.0 km', tempo: '30 min' },
  ],
  'Cappuccino': [
    { nome: 'Aurora Cafe', bairro: 'Centro', distancia: '1.2 km', tempo: '25 min' },
    { nome: 'Bistro Paulista', bairro: 'Pinheiros', distancia: '3.4 km', tempo: '40 min' },
    { nome: 'Vila Café', bairro: 'Vila Mariana', distancia: '2.8 km', tempo: '35 min' },
  ],
  'Latte': [
    { nome: 'Aurora Cafe', bairro: 'Centro', distancia: '1.2 km', tempo: '25 min' },
    { nome: 'Café Moema', bairro: 'Moema', distancia: '5.1 km', tempo: '55 min' },
    { nome: 'Lapa Café', bairro: 'Lapa', distancia: '8.5 km', tempo: '70 min' },
  ],
  'Machiato': [
    { nome: 'Bistro Paulista', bairro: 'Pinheiros', distancia: '3.4 km', tempo: '40 min' },
    { nome: 'Jardins Coffee', bairro: 'Jardins', distancia: '3.1 km', tempo: '35 min' },
  ],
  'Americano': [
    { nome: 'Aurora Cafe', bairro: 'Centro', distancia: '1.2 km', tempo: '25 min' },
    { nome: 'Vila Café', bairro: 'Vila Mariana', distancia: '2.8 km', tempo: '35 min' },
    { nome: 'Paulista Expresso', bairro: 'Bela Vista', distancia: '2.0 km', tempo: '30 min' },
  ],
  'Gelado': [
    { nome: 'Jardins Coffee', bairro: 'Jardins', distancia: '3.1 km', tempo: '35 min' },
    { nome: 'Itaim Coffee', bairro: 'Itaim Bibi', distancia: '6.0 km', tempo: '60 min' },
  ],
  'Chá': [
    { nome: 'Café Moema', bairro: 'Moema', distancia: '5.1 km', tempo: '55 min' },
    { nome: 'Vila Café', bairro: 'Vila Mariana', distancia: '2.8 km', tempo: '35 min' },
  ],
};

const TAMANHOS = [
  { key: 'P', label: 'P', multiplicador: 0.8 },
  { key: 'M', label: 'M', multiplicador: 1.0 },
  { key: 'G', label: 'G', multiplicador: 1.25 },
];

export default function ItemScreen({ navigation, route }) {
  const { produto } = route?.params || {
    produto: {
      id: '1', nome: 'Caffe Mocha', categoria: 'Espresso',
      preco: '20.00', avaliacao: '4.8',
      descricao: 'Espresso cremoso com chocolate, leite vaporizado e espuma fresca.',
    }
  };

  const [tamanho, setTamanho] = useState('M');
  const { adicionarAoPedido, isFavorito, adicionarFavorito, toastFavoritoMsg } = useApp();

  const precoBase = parseFloat(produto?.preco || '0');
  const tamanhoSelecionado = TAMANHOS.find(t => t.key === tamanho);
  const precoFinal = (precoBase * tamanhoSelecionado.multiplicador).toFixed(2);
  const favoritoAtivo = isFavorito(produto?.id, 'item');

  const cafeterias = CAFETERIAS_POR_CATEGORIA[produto?.categoria] ||
    [{ nome: 'Aurora Cafe', bairro: 'Centro', distancia: '1.2 km', tempo: '25 min' }];

  const imagem = IMAGENS[produto?.nome];

  function handleAdicionar() {
    adicionarAoPedido({ ...produto, tamanho, preco: precoFinal });
    if (navigation?.goBack) navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {toastFavoritoMsg ? (
        <View style={styles.toastFav}>
          <Text style={styles.toastFavTxt}>❤️ {toastFavoritoMsg}</Text>
        </View>
      ) : null}

      <View style={styles.imgArea}>
        {imagem ? (
          <Image source={imagem} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={styles.imgPlaceholder}>
            <Text style={styles.imgIcon}>☕</Text>
            <Text style={styles.imgTxt}>Foto do item</Text>
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
          onPress={() => adicionarFavorito(produto, 'item')}
        >
          <Text style={styles.heartTxt}>{favoritoAtivo ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.nome}>{produto?.nome}</Text>
        <Text style={styles.tipo}>{produto?.categoria}</Text>
        <Text style={styles.rating}>⭐ {produto?.avaliacao} (320 avaliações)</Text>

        <Text style={styles.secTitulo}>Descrição</Text>
        <Text style={styles.descricao}>{produto?.descricao}</Text>

        <Text style={styles.secTitulo}>Tamanho</Text>
        <View style={styles.tamanhoRow}>
          {TAMANHOS.map(t => {
            const preco = (precoBase * t.multiplicador).toFixed(2);
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tamBtn, tamanho === t.key && styles.tamBtnAtivo]}
                onPress={() => setTamanho(t.key)}
              >
                <Text style={[styles.tamLetra, tamanho === t.key && styles.tamLetraAtiva]}>{t.label}</Text>
                <Text style={[styles.tamPreco, tamanho === t.key && styles.tamPrecoAtivo]}>R$ {preco}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.secTitulo}>Disponível em</Text>
        {cafeterias.map((c, i) => (
          <View key={i} style={styles.cafeteriaRow}>
            <View style={styles.cafeteriaInfo}>
              <Text style={styles.cafeteriaNome}>{c.nome}</Text>
              <Text style={styles.cafeteriaDetalhe}>📍 {c.bairro} • {c.distancia} • ~{c.tempo}</Text>
            </View>
            <View style={styles.cafeteriaTag}>
              <Text style={styles.cafeteriaTagTxt}>Disponível</Text>
            </View>
          </View>
        ))}

        <View style={styles.precoRow}>
          <Text style={styles.precoLabel}>Preço ({tamanho})</Text>
          <Text style={styles.preco}>R$ {precoFinal}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botao} onPress={handleAdicionar}>
          <Text style={styles.botaoTxt}>Adicionar ao pedido — R$ {precoFinal}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  toastFav: {
    position: 'absolute', top: 60, left: 20, right: 20,
    backgroundColor: colors.dark, borderRadius: 12,
    padding: 12, zIndex: 999, alignItems: 'center',
  },
  toastFavTxt: { color: colors.white, fontSize: 14 },
  imgArea: { height: 220, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: { flex: 1, backgroundColor: colors.lightGray, alignItems: 'center', justifyContent: 'center' },
  imgIcon: { fontSize: 48 },
  imgTxt: { fontSize: 12, color: colors.gray, marginTop: 4 },
  backBtn: { position: 'absolute', top: 12, left: 12, width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: colors.medium },
  heartBtn: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  heartTxt: { fontSize: 18 },
  body: { flex: 1 },
  bodyContent: { padding: 20 },
  nome: { fontSize: 24, fontWeight: 'bold', color: colors.dark, marginBottom: 4 },
  tipo: { fontSize: 13, color: colors.gray, marginBottom: 4 },
  rating: { fontSize: 13, color: colors.gray, marginBottom: 16 },
  secTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.dark, marginBottom: 10 },
  descricao: { fontSize: 14, color: colors.gray, lineHeight: 22, marginBottom: 18 },
  tamanhoRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tamBtn: { flex: 1, borderWidth: 0.5, borderColor: colors.border, borderRadius: 10, padding: 10, alignItems: 'center', backgroundColor: colors.white },
  tamBtnAtivo: { borderColor: colors.gold, backgroundColor: '#fff8f0', borderWidth: 1.5 },
  tamLetra: { fontSize: 16, fontWeight: 'bold', color: colors.gray },
  tamLetraAtiva: { color: colors.gold },
  tamPreco: { fontSize: 11, color: colors.gray, marginTop: 3 },
  tamPrecoAtivo: { color: colors.medium },
  cafeteriaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.lightGray, borderRadius: 10, padding: 12, marginBottom: 8 },
  cafeteriaInfo: { flex: 1 },
  cafeteriaNome: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  cafeteriaDetalhe: { fontSize: 11, color: colors.gray, marginTop: 2 },
  cafeteriaTag: { backgroundColor: colors.successBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  cafeteriaTagTxt: { fontSize: 11, color: colors.success, fontWeight: '500' },
  precoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8 },
  precoLabel: { fontSize: 14, color: colors.gray },
  preco: { fontSize: 26, fontWeight: 'bold', color: colors.gold },
  footer: { padding: 16, backgroundColor: colors.white, borderTopWidth: 0.5, borderColor: colors.border },
  botao: { backgroundColor: colors.gold, borderRadius: 30, padding: 16, alignItems: 'center' },
  botaoTxt: { color: colors.white, fontSize: 15, fontWeight: 'bold' },
});