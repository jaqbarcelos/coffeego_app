import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Image, ScrollView
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const LARGURA_TELA = Dimensions.get('window').width;
const LARGURA_MENU = LARGURA_TELA * 0.78;

const ITENS_MENU = [
  { nome: 'Cardapio', label: 'Cardápio', icone: '☕' },
  { nome: 'MeusPedidos', label: 'Meus pedidos', icone: '🛍' },
  { nome: 'Favoritos', label: 'Favoritos', icone: '❤️' },
  { nome: 'CafeteriaLista', label: 'Cafeterias', icone: '🏪' },
  { nome: 'Delivery', label: 'Rastrear pedido', icone: '🛵' },
  { nome: 'Pedido', label: 'Meu pedido', icone: '🧾' },
  { nome: 'Perfil', label: 'Meu perfil', icone: '👤' },
];

// Menu lateral
export function MenuLateral({ slideAnim, aberto, telaAtiva, onNavegar, onFechar, onSair }) {
  const { usuarioLogado } = useApp();
  const usuario = usuarioLogado || { nome: 'Visitante', email: 'visitante@coffeego.com' };

  if (!aberto) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.fundo} onPress={onFechar} activeOpacity={1} />
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo_horizontal_clara.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>
                {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName} numberOfLines={1}>{usuario.nome}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{usuario.email}</Text>
            </View>
          </View>
        </View>
        <ScrollView>
          {ITENS_MENU.map(item => (
            <TouchableOpacity
              key={item.nome}
              style={[styles.item, telaAtiva === item.nome && styles.itemAtivo]}
              onPress={() => onNavegar(item.nome)}
            >
              <Text style={styles.itemIcone}>{item.icone}</Text>
              <Text style={[
                styles.itemLabel,
                telaAtiva === item.nome && styles.itemLabelAtivo
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.sairBtn} onPress={onSair}>
          <Text style={styles.sairIcone}>↪</Text>
          <Text style={styles.sairTxt}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999,
    flexDirection: 'row',
  },
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: LARGURA_MENU,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.dark,
    padding: 20,
    paddingTop: 50,
  },
  logo: { width: 140, height: 48, marginBottom: 16 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarTxt: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  userName: { fontSize: 13, color: colors.white, fontWeight: '500' },
  userEmail: { fontSize: 11, color: colors.lightGold, opacity: 0.8 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, paddingHorizontal: 20,
    borderBottomWidth: 0.5, borderColor: colors.lightGray,
  },
  itemAtivo: {
    backgroundColor: '#fff8f0',
    borderLeftWidth: 3, borderLeftColor: colors.gold,
  },
  itemIcone: { fontSize: 18 },
  itemLabel: { fontSize: 14, color: colors.gray, fontWeight: '500' },
  itemLabelAtivo: { color: colors.medium },
  sairBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, paddingHorizontal: 20,
    borderTopWidth: 0.5, borderColor: colors.border,
  },
  sairIcone: { fontSize: 18, color: colors.danger },
  sairTxt: { fontSize: 14, color: colors.danger, fontWeight: '500' },
});