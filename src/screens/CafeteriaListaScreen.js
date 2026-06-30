import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, ScrollView, Modal
} from 'react-native';
import { colors } from '../theme/colors';
import CafeteriaCard from '../components/CafeteriaCard';

const REGIOES_SP = [
  'Toda São Paulo', 'Centro', 'Pinheiros', 'Vila Mariana',
  'Moema', 'Jardins', 'Itaim Bibi', 'Bela Vista',
  'Lapa', 'Mooca', 'Santo André',
];

const FILTROS = [
  { id: 'avaliacao', label: '⭐ Melhor avaliação' },
  { id: 'distancia', label: '📍 Mais próximo' },
  { id: 'entrega_gratis', label: '🚀 Frete grátis' },
  { id: 'aberto', label: '🟢 Aberto agora' },
];

const CAFETERIAS = [
  {
    id: '1', nome: 'Aurora Café', bairro: 'Centro',
    distancia: '1.2 km', tempo: '25 min', entrega: '5',
    avaliacao: '4.9', aberto: true,
    descricao: 'O melhor café do centro de São Paulo, com grãos selecionados e ambiente aconchegante.',
  },
  {
    id: '2', nome: 'Bistro Paulista', bairro: 'Pinheiros',
    distancia: '3.4 km', tempo: '40 min', entrega: '8',
    avaliacao: '4.7', aberto: true,
    descricao: 'Café e bistrô no coração de Pinheiros. Ambiente moderno e cardápio variado.',
  },
  {
    id: '3', nome: 'Café Moema', bairro: 'Moema',
    distancia: '5.1 km', tempo: '55 min', entrega: '10',
    avaliacao: '4.5', aberto: false,
    descricao: 'Cafeteria familiar em Moema. Fechamos aos domingos após as 14h.',
  },
  {
    id: '4', nome: 'Vila Café', bairro: 'Vila Mariana',
    distancia: '2.8 km', tempo: '35 min', entrega: '7',
    avaliacao: '4.6', aberto: true,
    descricao: 'Cantinho acolhedor na Vila Mariana. Especialidade em cafés especiais.',
  },
  {
    id: '5', nome: 'Jardins Coffee', bairro: 'Jardins',
    distancia: '4.2 km', tempo: '45 min', entrega: '0',
    avaliacao: '4.8', aberto: true,
    descricao: 'Café premium nos Jardins. Frete grátis para pedidos acima de R$30.',
  },
  {
    id: '6', nome: 'Itaim Coffee', bairro: 'Itaim Bibi',
    distancia: '6.0 km', tempo: '60 min', entrega: '0',
    avaliacao: '4.7', aberto: true,
    descricao: 'Coffee shop no Itaim. Frete grátis e ambiente pet friendly.',
  },
  {
    id: '7', nome: 'Paulista Expresso', bairro: 'Bela Vista',
    distancia: '2.0 km', tempo: '30 min', entrega: '5',
    avaliacao: '4.6', aberto: true,
    descricao: 'Rápido e saboroso, perto da Av. Paulista. Ideal para o café da manhã.',
  },
  {
    id: '8', nome: 'Santo Café', bairro: 'Santo André',
    distancia: '28 km', tempo: '90 min', entrega: '12',
    avaliacao: '4.4', aberto: false,
    descricao: 'Cafeteria no ABC paulista. Fechado às segundas-feiras.',
  },
  {
    id: '9', nome: 'Lapa Café', bairro: 'Lapa',
    distancia: '8.5 km', tempo: '70 min', entrega: '0',
    avaliacao: '4.5', aberto: true,
    descricao: 'Café boêmio na Lapa com frete grátis e música ao vivo nas sextas.',
  },
  {
    id: '10', nome: 'Mooca Coffee', bairro: 'Mooca',
    distancia: '7.2 km', tempo: '65 min', entrega: '8',
    avaliacao: '4.8', aberto: true,
    descricao: 'Torrefação artesanal na Mooca. Grãos de origem única e métodos especiais.',
  },
];

const IMAGENS_CAFETERIAS = {
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

export default function CafeteriaListaScreen({ navigation }) {
  const [busca, setBusca] = useState('');
  const [regiao, setRegiao] = useState('Toda São Paulo');
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [modalRegiao, setModalRegiao] = useState(false);
  const [modalFiltro, setModalFiltro] = useState(false);

  function aplicarFiltro(lista) {
    let resultado = lista.filter(c => {
      const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase());
      const matchRegiao = regiao === 'Toda São Paulo' || c.bairro === regiao;
      return matchBusca && matchRegiao;
    });
    if (!filtroAtivo) return resultado;
    switch (filtroAtivo) {
      case 'avaliacao': return [...resultado].sort((a, b) => parseFloat(b.avaliacao) - parseFloat(a.avaliacao));
      case 'distancia': return [...resultado].sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));
      case 'entrega_gratis': return resultado.filter(c => c.entrega === '0');
      case 'aberto': return resultado.filter(c => c.aberto === true);
      default: return resultado;
    }
  }

  const cafeteriasFiltradas = aplicarFiltro(CAFETERIAS);

  return (
    <View style={styles.container}>

      <Modal visible={modalRegiao} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>📍 Selecionar região</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {REGIOES_SP.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.opcao, regiao === r && styles.opcaoAtiva]}
                  onPress={() => { setRegiao(r); setModalRegiao(false); }}
                >
                  <Text style={[styles.opcaoTxt, regiao === r && styles.opcaoTxtAtiva]}>
                    {r === 'Toda São Paulo' ? '🗺️' : '📍'} {r}
                  </Text>
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

      <Modal visible={modalFiltro} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>⚙️ Filtrar cafeterias</Text>
            {FILTROS.map(f => (
              <TouchableOpacity
                key={f.id}
                style={[styles.opcao, filtroAtivo === f.id && styles.opcaoAtiva]}
                onPress={() => { setFiltroAtivo(filtroAtivo === f.id ? null : f.id); setModalFiltro(false); }}
              >
                <Text style={[styles.opcaoTxt, filtroAtivo === f.id && styles.opcaoTxtAtiva]}>{f.label}</Text>
                {filtroAtivo === f.id && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
            {filtroAtivo && (
              <TouchableOpacity style={styles.limparFiltro} onPress={() => { setFiltroAtivo(null); setModalFiltro(false); }}>
                <Text style={styles.limparFiltroTxt}>✕ Limpar filtro</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.fechar} onPress={() => setModalFiltro(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity style={styles.locRow} onPress={() => setModalRegiao(true)}>
          <Text style={styles.locIcone}>📍</Text>
          <Text style={styles.locTxt}>
            {regiao === 'Toda São Paulo' ? 'São Paulo, SP' : `${regiao}, SP`}
          </Text>
          <Text style={styles.locSeta}>▾</Text>
        </TouchableOpacity>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cafeteria..."
              placeholderTextColor={colors.gray}
              value={busca}
              onChangeText={setBusca}
              autoCorrect={false}
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

        {filtroAtivo && (
          <View style={styles.filtroAtivoBar}>
            <Text style={styles.filtroAtivoTxt}>
              🔍 {FILTROS.find(f => f.id === filtroAtivo)?.label}
            </Text>
            <TouchableOpacity onPress={() => setFiltroAtivo(null)}>
              <Text style={styles.filtroAtivoRemover}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={cafeteriasFiltradas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <CafeteriaCard
            cafeteria={item}
            imagem={IMAGENS_CAFETERIAS[item.nome]}
            onPress={() => navigation.navigate('Cafeteria', { cafeteria: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.empty}>Nenhuma cafeteria encontrada</Text>
            <Text style={styles.emptySub}>Tente outra região ou remova os filtros</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { backgroundColor: colors.cream, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6, borderBottomWidth: 0.5, borderColor: colors.border },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 4 },
  locIcone: { fontSize: 14 },
  locTxt: { fontSize: 14, color: colors.dark, fontWeight: '600' },
  locSeta: { fontSize: 12, color: colors.gold, marginLeft: 2 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 24, paddingHorizontal: 12, height: 42 },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, color: colors.dark },
  filterBtn: { width: 42, height: 42, backgroundColor: colors.gold, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  filterBtnAtivo: { backgroundColor: colors.medium },
  filtroAtivoBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8, borderWidth: 0.5, borderColor: colors.gold },
  filtroAtivoTxt: { fontSize: 13, color: colors.medium, fontWeight: '500' },
  filtroAtivoRemover: { color: colors.gold, fontSize: 16, fontWeight: 'bold' },
  lista: { padding: 16, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  empty: { fontSize: 16, color: colors.gray, fontWeight: '500' },
  emptySub: { fontSize: 13, color: colors.gray, marginTop: 4, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.white, borderRadius: 20, padding: 20, margin: 12, paddingBottom: 30 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: colors.dark, marginBottom: 16 },
  opcao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10, backgroundColor: colors.lightGray, marginBottom: 6 },
  opcaoAtiva: { backgroundColor: '#fff8f0', borderWidth: 1, borderColor: colors.gold },
  opcaoTxt: { fontSize: 14, color: colors.gray, flex: 1 },
  opcaoTxtAtiva: { color: colors.medium, fontWeight: '600' },
  check: { color: colors.gold, fontSize: 16, fontWeight: 'bold' },
  limparFiltro: { padding: 12, alignItems: 'center' },
  limparFiltroTxt: { color: colors.danger, fontSize: 14 },
  fechar: { marginTop: 10, alignItems: 'center', padding: 12 },
  fecharTxt: { color: colors.gray, fontSize: 14 },
});