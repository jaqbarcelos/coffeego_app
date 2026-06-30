import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';

// IMAGENS DOS PRODUTOS
const IMAGENS = {
  'Caffe Mocha': require('../../../assets/caffe_mocha.jpg'),
  'Flat White': require('../../../assets/flat_white.jpg'),
  'Latte Art': require('../../../assets/latte_art.jpg'),
  'Machiato': require('../../../assets/machiato.jpg'),
  'Machiato Clássico': require('../../../assets/machiato.jpg'),
  'Caramel Machiato': require('../../../assets/machiato.jpg'),
  'Americano': require('../../../assets/americano.jpg'),
  'Americano Gelado': require('../../../assets/americano.jpg'),
  'Cappuccino': require('../../../assets/cappuccino.jpg'),
  'Cappuccino Clássico': require('../../../assets/cappuccino.jpg'),
  'Cappuccino Gelado': require('../../../assets/cappuccino.jpg'),
  'Vienna Coffee': require('../../../assets/cappuccino.jpg'),
  'Espresso Simples': require('../../../assets/americano.jpg'),
  'Espresso Duplo': require('../../../assets/americano.jpg'),
  'Ristretto': require('../../../assets/americano.jpg'),
  'Cortado': require('../../../assets/americano.jpg'),
  'Vanilla Latte': require('../../../assets/latte_art.jpg'),
  'Caramel Latte': require('../../../assets/latte_art.jpg'),
  'Chai Latte': require('../../../assets/latte_art.jpg'),
  'Matcha Latte': require('../../../assets/latte_art.jpg'),
  'Cold Brew': require('../../../assets/caffe_mocha.jpg'),
  'Frappuccino': require('../../../assets/caffe_mocha.jpg'),
  'Café Tônica': require('../../../assets/caffe_mocha.jpg'),
};

export default function ProdutoCard({ produto, onAdicionar, onPress }) {
  const { nome, categoria, preco, avaliacao } = produto;
  const imagem = IMAGENS[nome];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imgArea}>
        {imagem ? (
          <Image source={imagem} style={styles.img} resizeMode="cover" />
        ) : (
          <View style={styles.imgPlaceholder}>
            <Text style={styles.imgPlaceholderIcon}>☕</Text>
            <Text style={styles.imgPlaceholderTxt}>Foto do produto</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingTxt}>⭐ {avaliacao}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.categoria}>{categoria}</Text>
        <View style={styles.rodape}>
          <Text style={styles.preco}>R$ {preco}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={e => { e.stopPropagation?.(); onAdicionar(produto); }}
          >
            <Text style={styles.addBtnTxt}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imgArea: { height: 90, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: {
    flex: 1,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgPlaceholderIcon: { fontSize: 22 },
  imgPlaceholderTxt: { fontSize: 10, color: colors.gray, marginTop: 2 },
  ratingBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1,
  },
  ratingTxt: { fontSize: 9, color: '#f7d96b' },
  body: { padding: 8, backgroundColor: colors.cream },
  nome: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  categoria: { fontSize: 11, color: colors.gray, marginBottom: 6 },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preco: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  addBtn: {
    width: 24, height: 24,
    backgroundColor: colors.gold,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnTxt: { color: colors.white, fontSize: 18, lineHeight: 22, fontWeight: '300' },
});