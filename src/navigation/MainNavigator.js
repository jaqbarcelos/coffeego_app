import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Image, Animated
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { MenuLateral } from './DrawerCustomizado';

import CardapioScreen from '../screens/CardapioScreen';
import PedidoScreen from '../screens/PedidoScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import CafeteriaListaScreen from '../screens/CafeteriaListaScreen';
import CafeteriaScreen from '../screens/CafeteriaScreen';
import MeusPedidosScreen from '../screens/MeusPedidosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ItemScreen from '../screens/ItemScreen';
import FavoritosScreen from '../screens/FavoritosScreen';

const LARGURA_MENU = require('react-native').Dimensions.get('window').width * 0.78;

// ASSETS DA BARRA INFERIOR
const ICONES_BARRA = {
  home: require('../../assets/home.png'),
  pedidos: require('../../assets/pedidos.png'),
  delivery: require('../../assets/delivery.png'),
  perfil: require('../../assets/perfil.png'),
};

const TELAS = {
  Cardapio: CardapioScreen,
  MeusPedidos: MeusPedidosScreen,
  CafeteriaLista: CafeteriaListaScreen,
  Delivery: DeliveryScreen,
  Pedido: PedidoScreen,
  Perfil: PerfilScreen,
  Favoritos: FavoritosScreen,
};

const TITULOS = {
  Cardapio: 'Cardápio',
  MeusPedidos: 'Meus Pedidos',
  CafeteriaLista: 'Cafeterias',
  Delivery: 'Rastrear Pedido',
  Pedido: 'Meu Pedido',
  Perfil: 'Meu Perfil',
  Favoritos: 'Favoritos',
};

const BARRA_ITENS = [
  { tela: 'Cardapio', icone: 'home', label: 'Início' },
  { tela: 'Pedido', icone: 'pedidos', label: 'Pedido' },
  { tela: 'Delivery', icone: 'delivery', label: 'Delivery' },
  { tela: 'Perfil', icone: 'perfil', label: 'Perfil' },
];

export default function MainNavigator({ navigation }) {
  const [telaAtiva, setTelaAtiva] = useState('Cardapio');
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [cafeteriaSelecionada, setCafeteriaSelecionada] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const slideAnim = useRef(new Animated.Value(-LARGURA_MENU)).current;
  const { setUsuarioLogado, pedido } = useApp();

  function abrirDrawer() {
    setDrawerAberto(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }

  function fecharDrawer() {
    Animated.timing(slideAnim, {
      toValue: -LARGURA_MENU,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setDrawerAberto(false));
  }

  function navegarDrawer(tela) {
    fecharDrawer();
    setTimeout(() => {
      setCafeteriaSelecionada(null);
      setProdutoSelecionado(null);
      setTelaAtiva(tela);
    }, 260);
  }

  function navegar(tela, params) {
    if (tela === 'Item') {
      setProdutoSelecionado(params?.produto);
      return;
    }
    if (tela === 'Cafeteria') {
      setCafeteriaSelecionada(params?.cafeteria);
      return;
    }
    setCafeteriaSelecionada(null);
    setProdutoSelecionado(null);
    setTelaAtiva(tela);
  }

  function handleSair() {
    fecharDrawer();
    setTimeout(() => {
      setUsuarioLogado(null);
      navigation.replace('Login');
    }, 300);
  }

  function renderTela() {
    if (produtoSelecionado) {
      return (
        <ItemScreen
          navigation={{
            goBack: () => setProdutoSelecionado(null),
            navigate: navegar,
          }}
          route={{ params: { produto: produtoSelecionado } }}
        />
      );
    }

    if (cafeteriaSelecionada) {
      return (
        <CafeteriaScreen
          navigation={{
            goBack: () => setCafeteriaSelecionada(null),
            navigate: navegar,
          }}
          route={{ params: { cafeteria: cafeteriaSelecionada } }}
        />
      );
    }

    const Tela = TELAS[telaAtiva] || CardapioScreen;

    return (
      <Tela
        navigation={{
          navigate: navegar,
          goBack: () => setTelaAtiva('Cardapio'),
          replace: (tela) => setTelaAtiva(tela),
          openDrawer: abrirDrawer,
        }}
        route={{ params: {} }}
      />
    );
  }

  const tituloPagina = produtoSelecionado
    ? 'Detalhe do item'
    : cafeteriaSelecionada
    ? 'Cafeteria'
    : TITULOS[telaAtiva] || 'CoffeeGo';

  const totalItens = pedido.reduce((soma, item) => soma + item.quantidade, 0);
  const telaBarraAtiva = (produtoSelecionado || cafeteriaSelecionada) ? null : telaAtiva;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={abrirDrawer}>
          <Text style={styles.menuBtnTxt}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo} numberOfLines={1}>{tituloPagina}</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      {/* Conteúdo */}
      <View style={styles.conteudo}>
        {renderTela()}
      </View>

      {/* Barra inferior */}
      <View style={styles.barraInferior}>
        {BARRA_ITENS.map(item => (
          <TouchableOpacity
            key={item.tela}
            style={styles.barraItem}
            onPress={() => navegar(item.tela)}
          >
            <View style={styles.barraIconeContainer}>
              <Image
                source={ICONES_BARRA[item.icone]}
                style={[
                  styles.barraIcone,
                  telaBarraAtiva === item.tela && styles.barraIconeAtivo,
                ]}
                resizeMode="contain"
              />
              {item.tela === 'Pedido' && totalItens > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTxt}>{totalItens}</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.barraLabel,
              telaBarraAtiva === item.tela && styles.barraLabelAtivo,
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu Drawer */}
      <MenuLateral
        slideAnim={slideAnim}
        aberto={drawerAberto}
        telaAtiva={telaAtiva}
        onNavegar={navegarDrawer}
        onFechar={fecharDrawer}
        onSair={handleSair}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    backgroundColor: colors.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuBtn: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  menuBtnTxt: { fontSize: 22, color: colors.lightGold },
  headerTitulo: {
    fontSize: 16, fontWeight: 'bold',
    color: colors.white, flex: 1,
    textAlign: 'center',
  },
  conteudo: { flex: 1 },
  barraInferior: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  barraItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  barraIconeContainer: { position: 'relative' },
  barraIcone: {
    width: 26, height: 26,
    opacity: 0.4,
    tintColor: colors.gray,
  },
  barraIconeAtivo: {
    opacity: 1,
    tintColor: colors.gold,
  },
  badge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: colors.danger,
    borderRadius: 8, minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeTxt: { color: colors.white, fontSize: 9, fontWeight: 'bold' },
  barraLabel: { fontSize: 10, color: colors.gray, marginTop: 3, fontWeight: '500' },
  barraLabelAtivo: { color: colors.gold, fontWeight: '700' },
});