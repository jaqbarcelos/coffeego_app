import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, Alert
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const CUPONS = [
  { id: 'CAFE10', codigo: 'CAFE10', descricao: '10% de desconto', valor: 5.00, tipo: 'percentual', percentual: 10 },
  { id: 'FRETE0', codigo: 'FRETE0', descricao: 'Frete grátis', valor: 5.00, tipo: 'frete' },
  { id: 'PRIMEIRACOMPRA', codigo: 'PRIMEIRACOMPRA', descricao: 'R$ 8 off na primeira compra', valor: 8.00, tipo: 'fixo' },
];

const ENDERECO_CAFETERIA = 'Rua das Flores, 123 — Centro, São Paulo, SP\nAurora Café & Bistrô';

export default function PedidoScreen({ navigation }) {
  const [tipoEntrega, setTipoEntrega] = useState('Delivery');
  const [modalCupom, setModalCupom] = useState(false);
  const {
    pedido, adicionarAoPedido, removerDoPedido,
    subtotal, totalPedido, desconto,
    cupomSelecionado, setCupomSelecionado,
    enderecoEntrega, usuarioLogado
  } = useApp();

  const enderecoExibido = tipoEntrega === 'Delivery'
    ? (enderecoEntrega || 'Rua das Flores, 123 — Centro, São Paulo, SP')
    : ENDERECO_CAFETERIA;

  function handleConfirmar() {
    if (pedido.length === 0) {
      Alert.alert('Atenção', 'Seu pedido está vazio!');
      return;
    }
    navigation.navigate('Delivery');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Meu Pedido</Text>
      </View>

      {/* Cupons */}
      <Modal visible={modalCupom} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>🏷️ Cupons disponíveis</Text>
            {CUPONS.map(cupom => (
              <TouchableOpacity
                key={cupom.id}
                style={[styles.cupomCard, cupomSelecionado?.id === cupom.id && styles.cupomAtivo]}
                onPress={() => {
                  setCupomSelecionado(cupomSelecionado?.id === cupom.id ? null : cupom);
                  setModalCupom(false);
                }}
              >
                <View style={styles.cupomLeft}>
                  <Text style={styles.cupomCodigo}>{cupom.codigo}</Text>
                  <Text style={styles.cupomDesc}>{cupom.descricao}</Text>
                </View>
                <View style={styles.cupomRight}>
                  <Text style={styles.cupomValor}>-R$ {cupom.valor.toFixed(2)}</Text>
                  {cupomSelecionado?.id === cupom.id && <Text style={styles.cupomCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalFechar} onPress={() => setModalCupom(false)}>
              <Text style={styles.modalFecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.tabRow}>
          {['Delivery', 'Retirada'].map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tipoEntrega === t && styles.tabAtivo]}
              onPress={() => setTipoEntrega(t)}
            >
              <Text style={[styles.tabTxt, tipoEntrega === t && styles.tabTxtAtivo]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.secao}>
          <Text style={styles.secTitulo}>
            {tipoEntrega === 'Delivery' ? '📍 Endereço de entrega' : '🏪 Retirar em'}
          </Text>
          <View style={styles.enderecoCard}>
            <Text style={styles.enderecoNome}>
              {tipoEntrega === 'Delivery' ? 'Rua das Flores, 123' : 'Aurora Café & Bistrô'}
            </Text>
            <Text style={styles.enderecoSub}>
              {tipoEntrega === 'Delivery'
                ? 'Centro — São Paulo, SP'
                : 'Rua das Flores, 123 — Centro, São Paulo, SP'}
            </Text>
            {tipoEntrega === 'Delivery' && (
              <View style={styles.enderecoRow}>
                <TouchableOpacity style={styles.enderecoBtn}><Text style={styles.enderecoBtnTxt}>Editar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.enderecoBtn}><Text style={styles.enderecoBtnTxt}>+ Nota</Text></TouchableOpacity>
              </View>
            )}
            {tipoEntrega === 'Retirada' && (
              <Text style={styles.retiradaInfo}>⏰ Pronto em ~20 min</Text>
            )}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secTitulo}>Itens do pedido</Text>
          {pedido.length === 0 ? (
            <Text style={styles.vazioTxt}>Nenhum item. Vá ao cardápio!</Text>
          ) : (
            pedido.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemThumb}>
                  <Text style={{ fontSize: 18 }}>☕</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNome}>{item.nome}</Text>
                  <Text style={styles.itemSub}>{item.categoria}</Text>
                  <Text style={styles.itemPreco}>R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}</Text>
                </View>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => removerDoPedido(item.id)}>
                    <Text style={styles.qtyBtnTxt}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{item.quantidade}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => adicionarAoPedido(item)}>
                    <Text style={styles.qtyBtnTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.secao}>
          <TouchableOpacity style={styles.descontoRow} onPress={() => setModalCupom(true)}>
            <View style={styles.descontoLeft}>
              <View style={styles.descontoIcon}><Text style={{ fontSize: 10 }}>🏷</Text></View>
              <View>
                <Text style={styles.descontoTxt}>
                  {cupomSelecionado ? `Cupom: ${cupomSelecionado.codigo}` : 'Adicionar cupom de desconto'}
                </Text>
                {cupomSelecionado && (
                  <Text style={styles.descontoEconomia}>Economia de R$ {cupomSelecionado.valor.toFixed(2)}</Text>
                )}
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secao}>
          <Text style={styles.secTitulo}>Resumo do pagamento</Text>
          <View style={styles.resumoCard}>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Subtotal</Text>
              <Text style={styles.resumoVal}>R$ {subtotal.toFixed(2)}</Text>
            </View>
            {tipoEntrega === 'Delivery' && (
              <View style={styles.resumoRow}>
                <Text style={styles.resumoLabel}>Entrega</Text>
                <Text style={styles.resumoVal}>{desconto >= 5 && cupomSelecionado?.tipo === 'frete' ? 'Grátis 🎉' : 'R$ 5,00'}</Text>
              </View>
            )}
            {cupomSelecionado && (
              <View style={styles.resumoRow}>
                <Text style={[styles.resumoLabel, { color: colors.success }]}>Desconto ({cupomSelecionado.codigo})</Text>
                <Text style={[styles.resumoVal, { color: colors.success }]}>-R$ {desconto.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>💳 Total</Text>
              <Text style={styles.totalValor}>R$ {totalPedido.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botao} onPress={handleConfirmar}>
          <Text style={styles.botaoTxt}>Confirmar pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderBottomWidth: 0.5, borderColor: colors.border, backgroundColor: colors.white, position: 'relative' },
  backBtn: { position: 'absolute', left: 14, width: 32, height: 32, backgroundColor: colors.lightGray, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 18, color: colors.medium },
  titulo: { fontSize: 16, fontWeight: 'bold', color: colors.dark },
  scroll: { padding: 16, paddingBottom: 30 },
  tabRow: { flexDirection: 'row', backgroundColor: colors.lightGray, borderRadius: 24, padding: 3, marginBottom: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 22, alignItems: 'center' },
  tabAtivo: { backgroundColor: colors.gold },
  tabTxt: { fontSize: 13, fontWeight: '500', color: colors.gray },
  tabTxtAtivo: { color: colors.white },
  secao: { marginBottom: 16 },
  secTitulo: { fontSize: 13, fontWeight: 'bold', color: colors.dark, marginBottom: 8 },
  enderecoCard: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12 },
  enderecoNome: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  enderecoSub: { fontSize: 11, color: colors.gray, marginBottom: 8 },
  enderecoRow: { flexDirection: 'row', gap: 8 },
  enderecoBtn: { borderWidth: 0.5, borderColor: colors.border, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  enderecoBtnTxt: { fontSize: 11, color: colors.gray },
  retiradaInfo: { fontSize: 12, color: colors.gold, fontWeight: '500' },
  vazioTxt: { fontSize: 14, color: colors.gray, textAlign: 'center', paddingVertical: 20 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 10, marginBottom: 8 },
  itemThumb: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.lightGray, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  itemSub: { fontSize: 11, color: colors.gray },
  itemPreco: { fontSize: 12, color: colors.gold, fontWeight: '600', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: { width: 24, height: 24, backgroundColor: colors.lightGray, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  qtyBtnTxt: { fontSize: 16, color: colors.dark, lineHeight: 22 },
  qtyNum: { fontSize: 13, fontWeight: '500', color: colors.dark, minWidth: 16, textAlign: 'center' },
  descontoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12 },
  descontoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  descontoIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  descontoTxt: { fontSize: 13, fontWeight: '500', color: colors.dark },
  descontoEconomia: { fontSize: 11, color: colors.success },
  chevron: { fontSize: 20, color: colors.gray },
  resumoCard: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12 },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  resumoLabel: { fontSize: 13, color: colors.gray },
  resumoVal: { fontSize: 13, fontWeight: '500', color: colors.dark },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 0.5, borderColor: colors.border, marginTop: 4 },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: colors.dark },
  totalValor: { fontSize: 16, fontWeight: 'bold', color: colors.gold },
  footer: { padding: 16, backgroundColor: colors.white, borderTopWidth: 0.5, borderColor: colors.border },
  botao: { backgroundColor: colors.gold, borderRadius: 30, padding: 16, alignItems: 'center' },
  botaoTxt: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.white, borderRadius: 20, padding: 20, margin: 12, paddingBottom: 30 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: colors.dark, marginBottom: 16 },
  cupomCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: colors.lightGray, marginBottom: 8 },
  cupomAtivo: { backgroundColor: '#fff8f0', borderWidth: 1.5, borderColor: colors.gold },
  cupomLeft: { flex: 1 },
  cupomCodigo: { fontSize: 14, fontWeight: 'bold', color: colors.dark },
  cupomDesc: { fontSize: 12, color: colors.gray, marginTop: 2 },
  cupomRight: { alignItems: 'flex-end' },
  cupomValor: { fontSize: 14, fontWeight: 'bold', color: colors.success },
  cupomCheck: { color: colors.gold, fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  modalFechar: { marginTop: 10, alignItems: 'center', padding: 12 },
  modalFecharTxt: { color: colors.gray, fontSize: 14 },
});