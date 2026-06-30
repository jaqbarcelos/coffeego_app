import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TextInput,
  TouchableOpacity, ScrollView, Modal
} from 'react-native';
import { colors } from '../theme/colors';
import ProdutoCard from '../components/ProdutoCard';
import { useApp } from '../context/AppContext';

const API_URL = 'https://6a1f1c50b79eec0d6cf085af.mockapi.io/produtos';

const CATEGORIAS = ['Todos', 'Espresso', 'Cappuccino', 'Latte', 'Machiato', 'Americano', 'Gelado', 'Chá'];

const REGIOES_SP = [
  'Centro', 'Zona Sul', 'Zona Norte', 'Zona Leste', 'Zona Oeste',
  'Pinheiros', 'Vila Mariana', 'Moema', 'Jardins', 'Itaim Bibi',
  'Santo André', 'São Bernardo', 'Guarulhos'
];

const FILTROS_OPCOES = [
  { id: 'preco_asc', label: '💰 Menor preço' },
  { id: 'preco_desc', label: '💰 Maior preço' },
  { id: 'avaliacao', label: '⭐ Melhor avaliação' },
  { id: 'nome', label: '☕ Produto' },
];

export default function CardapioScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [carregando, setCarregando] = useState(true);
  const [regiao, setRegiao] = useState('Centro');
  const [modalRegiao, setModalRegiao] = useState(false);
  const [modalFiltro, setModalFiltro] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [toastVisivel, setToastVisivel] = useState(false);
  const [toastProduto, setToastProduto] = useState('');
  const { adicionarAoPedido } = useApp();

  useEffect(() => { buscarProdutos(); }, []);

  async function buscarProdutos() {
    try {
      const res = await fetch(API_URL);
      const dados = await res.json();
      setProdutos(Array.isArray(dados) ? dados : []);
    } catch {
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  }

  function handleAdicionar(produto) {
    adicionarAoPedido(produto);
    setToastProduto(produto.nome);
    setToastVisivel(true);
    setTimeout(() => setToastVisivel(false), 3000);
  }

  function handleProdutoPress(produto) {
    navigation.navigate('Item', { produto });
  }

  function aplicarOrdem(lista) {
    if (!filtroAtivo) return lista;
    switch (filtroAtivo) {
      case 'preco_asc': return [...lista].sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
      case 'preco_desc': return [...lista].sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
      case 'avaliacao': return [...lista].sort((a, b) => parseFloat(b.avaliacao) - parseFloat(a.avaliacao));
      case 'nome': return [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
      default: return lista;
    }
  }

  const produtosFiltrados = aplicarOrdem(
    produtos.filter(p => {
      const matchBusca = p.nome?.toLowerCase().includes(busca.toLowerCase());
      const matchCat = categoria === 'Todos' || p.categoria === categoria;
      return matchBusca && matchCat;
    })
  );

  if (carregando) {
    return (
      <View style={styles.centralize}>
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingTxt}>Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {toastVisivel && (
        <View style={styles.toast}>
          <Text style={styles.toastTxt}>☕ {toastProduto} adicionado!</Text>
          <View style={styles.toastBtns}>
            <TouchableOpacity onPress={() => { setToastVisivel(false); navigation.navigate('Pedido'); }}>
              <Text style={styles.toastBtnPrimary}>Ver carrinho →</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setToastVisivel(false)}>
              <Text style={styles.toastBtnSecondary}>Continuar comprando</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Região */}
      <Modal visible={modalRegiao} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>📍 Selecionar região</Text>
            <Text style={styles.modalSub}>Mostrando cafeterias próximas de:</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {REGIOES_SP.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.opcao, regiao === r && styles.opcaoAtiva]}
                  onPress={() => { setRegiao(r); setModalRegiao(false); }}
                >
                  <Text style={[styles.opcaoTxt, regiao === r && styles.opcaoTxtAtiva]}>📍 {r} — São Paulo, SP</Text>
                  {regiao === r && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.fechar} onPress={() => setModalRegiao(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filtros */}
      <Modal visible={modalFiltro} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>⚙️ Ordenar por</Text>
            {FILTROS_OPCOES.map(f => (
              <TouchableOpacity
                key={f.id}
                style={[styles.opcao, filtroAtivo === f.id && styles.opcaoAtiva]}
                onPress={() => { setFiltroAtivo(filtroAtivo === f.id ? null : f.id); setModalFiltro(false); }}
              >
                <Text style={[styles.opcaoTxt, filtroAtivo === f.id && styles.opcaoTxtAtiva]}>{f.label}</Text>
                {filtroAtivo === f.id && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.fechar} onPress={() => setModalFiltro(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity style={styles.locRow} onPress={() => setModalRegiao(true)}>
          <Text style={styles.locIcone}>📍</Text>
          <Text style={styles.locTxt}>{regiao}, SP</Text>
          <Text style={styles.locSeta}>▾</Text>
        </TouchableOpacity>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar café..."
              placeholderTextColor={colors.gray}
              value={busca}
              onChangeText={setBusca}
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={() => setBusca('')}>
                <Text style={{ color: colors.gray, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, filtroAtivo && styles.filterBtnAtivo]}
            onPress={() => setModalFiltro(true)}
          >
            <Text style={{ color: colors.white, fontSize: 16 }}>⚙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <View style={styles.promoBadge}><Text style={styles.promoTxt}>Promo</Text></View>
          <Text style={styles.bannerTxt}>Compre 1, leve 2 🎉</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
          {CATEGORIAS.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, categoria === cat && styles.chipAtivo]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[styles.chipTxt, categoria === cat && styles.chipTxtAtivo]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item, i) => item.id?.toString() || i.toString()}
        numColumns={2}
        columnWrapperStyle={styles.colWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProdutoCard
              produto={item}
              onAdicionar={handleAdicionar}
              onPress={() => handleProdutoPress(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>☕</Text>
            <Text style={styles.empty}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySub}>Tente outra categoria ou busca</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  centralize: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cream },
  loadingTxt: { color: colors.gold, marginTop: 10 },
  header: { backgroundColor: colors.cream, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, borderBottomWidth: 0.5, borderColor: colors.border },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 4 },
  locIcone: { fontSize: 14 },
  locTxt: { fontSize: 14, color: colors.dark, fontWeight: '600' },
  locSeta: { fontSize: 12, color: colors.gold, marginLeft: 2 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 24, paddingHorizontal: 12, height: 42 },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, color: colors.dark },
  filterBtn: { width: 42, height: 42, backgroundColor: colors.gold, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  filterBtnAtivo: { backgroundColor: colors.medium },
  banner: { backgroundColor: colors.medium, borderRadius: 12, padding: 14, marginBottom: 10 },
  promoBadge: { backgroundColor: colors.danger, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4 },
  promoTxt: { color: colors.white, fontSize: 10, fontWeight: 'bold' },
  bannerTxt: { fontSize: 18, fontWeight: 'bold', color: colors.white },
  categoriasScroll: { marginBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.07)', marginRight: 8 },
  chipAtivo: { backgroundColor: colors.gold },
  chipTxt: { fontSize: 13, fontWeight: '500', color: colors.gray },
  chipTxtAtivo: { color: colors.white },
  colWrapper: { paddingHorizontal: 16, gap: 10 },
  listContent: { paddingTop: 10, paddingBottom: 100 },
  cardWrapper: { flex: 1 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  empty: { fontSize: 16, color: colors.gray, fontWeight: '500' },
  emptySub: { fontSize: 13, color: colors.gray, marginTop: 4 },
  toast: {
    position: 'absolute', bottom: 80, left: 16, right: 16,
    backgroundColor: colors.dark, borderRadius: 14, padding: 14, zIndex: 999,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  toastTxt: { color: colors.white, fontSize: 14, fontWeight: '500', marginBottom: 10 },
  toastBtns: { flexDirection: 'row', justifyContent: 'space-between' },
  toastBtnPrimary: { color: colors.gold, fontSize: 14, fontWeight: 'bold' },
  toastBtnSecondary: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.white, borderRadius: 20, padding: 20, margin: 12, paddingBottom: 30 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: colors.dark, marginBottom: 6 },
  modalSub: { fontSize: 13, color: colors.gray, marginBottom: 12 },
  opcao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10, backgroundColor: colors.lightGray, marginBottom: 6 },
  opcaoAtiva: { backgroundColor: '#fff8f0', borderWidth: 1, borderColor: colors.gold },
  opcaoTxt: { fontSize: 14, color: colors.gray, flex: 1 },
  opcaoTxtAtiva: { color: colors.medium, fontWeight: '600' },
  check: { color: colors.gold, fontSize: 16, fontWeight: 'bold' },
  fechar: { marginTop: 10, alignItems: 'center', padding: 12 },
  fecharTxt: { color: colors.gray, fontSize: 14 },
});