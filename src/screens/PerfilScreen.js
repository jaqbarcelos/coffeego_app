import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Modal, TextInput,
  ActivityIndicator
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const API_USUARIOS = 'https://6a1f1c50b79eec0d6cf085af.mockapi.io/usuarios';

export default function PerfilScreen({ navigation }) {
  const { usuarioLogado, setUsuarioLogado } = useApp();
  const usuario = usuarioLogado || { nome: 'Visitante', email: 'visitante@coffeego.com', id: '' };

  const [enderecos, setEnderecos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [modalDados, setModalDados] = useState(false);
  const [modalEnderecos, setModalEnderecos] = useState(false);
  const [modalNovoEndereco, setModalNovoEndereco] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [modalNotif, setModalNotif] = useState(false);
  const [modalAjuda, setModalAjuda] = useState(false);

  const [novoNome, setNovoNome] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoEndereco, setNovoEndereco] = useState('');
  const [notifPedidos, setNotifPedidos] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    if (!usuario.id) { setCarregando(false); return; }
    try {
      const res = await fetch(`${API_USUARIOS}/${usuario.id}`);
      const dados = await res.json();
      setNovoNome(dados.nome || usuario.nome);
      setNovoTelefone(dados.telefone || '');
      try {
        setEnderecos(JSON.parse(dados.enderecos || '[]'));
      } catch {
        setEnderecos([]);
      }
      setUsuarioLogado(prev => ({ ...prev, nome: dados.nome, telefone: dados.telefone }));
    } catch {
      setNovoNome(usuario.nome);
    } finally {
      setCarregando(false);
    }
  }

  async function salvarDados() {
    if (!usuario.id) { Alert.alert('Erro', 'Usuário não identificado.'); return; }
    setSalvando(true);
    try {
      await fetch(`${API_USUARIOS}/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoNome,
          telefone: novoTelefone,
          enderecos: JSON.stringify(enderecos),
        }),
      });
      setUsuarioLogado(prev => ({ ...prev, nome: novoNome, telefone: novoTelefone }));
      setModalDados(false);
      Alert.alert('✅', 'Dados atualizados com sucesso!');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  async function salvarEnderecos(novosEnderecos) {
    if (!usuario.id) return;
    try {
      await fetch(`${API_USUARIOS}/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enderecos: JSON.stringify(novosEnderecos) }),
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o endereço.');
    }
  }

  async function adicionarEndereco() {
    if (!novoEndereco.trim()) { Alert.alert('Atenção', 'Informe o endereço.'); return; }
    const novos = [...enderecos, novoEndereco.trim()];
    setEnderecos(novos);
    setNovoEndereco('');
    setModalNovoEndereco(false);
    await salvarEnderecos(novos);
    Alert.alert('✅', 'Endereço adicionado!');
  }

  async function removerEndereco(index) {
    Alert.alert('Remover endereço', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const novos = enderecos.filter((_, i) => i !== index);
          setEnderecos(novos);
          await salvarEnderecos(novos);
        }
      }
    ]);
  }

  function handleSair() {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive', onPress: () => {
          setUsuarioLogado(null);
          navigation.replace('Login');
        }
      },
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.centralize}>
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={{ color: colors.gray, marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  const nomeExibido = novoNome || usuario.nome || 'Usuário';

  const MENU_ITEMS = [
    { icon: '👤', label: 'Dados pessoais', onPress: () => setModalDados(true) },
    { icon: '📍', label: 'Endereços', onPress: () => setModalEnderecos(true) },
    { icon: '💳', label: 'Pagamentos', onPress: () => setModalPagamento(true) },
    { icon: '🔔', label: 'Notificações', onPress: () => setModalNotif(true) },
    { icon: '❓', label: 'Ajuda', onPress: () => setModalAjuda(true) },
  ];

  return (
    <View style={styles.container}>

      {/* Dados Pessoais */}
      <Modal visible={modalDados} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>👤 Dados pessoais</Text>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Seu nome"
              autoCorrect={false}
              blurOnSubmit={false}
            />
            <Text style={styles.inputLabel}>E-mail (não editável)</Text>
            <View style={styles.emailField}>
              <Text style={styles.emailTxt}>{usuario.email}</Text>
            </View>
            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput
              style={styles.modalInput}
              value={novoTelefone}
              onChangeText={setNovoTelefone}
              placeholder="11 99999-9999"
              keyboardType="phone-pad"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.modalBtn, salvando && styles.btnDisabled]}
              onPress={salvarDados}
              disabled={salvando}
            >
              {salvando
                ? <ActivityIndicator color={colors.white} />
                : <Text style={styles.modalBtnTxt}>Salvar alterações</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.fechar} onPress={() => setModalDados(false)}>
              <Text style={styles.fecharTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Endereços */}
      <Modal visible={modalEnderecos} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>📍 Meus endereços</Text>
            {enderecos.length === 0
              ? <Text style={styles.semEndereco}>Nenhum endereço cadastrado ainda.</Text>
              : enderecos.map((end, i) => (
                <View key={i} style={styles.enderecoItem}>
                  <Text style={styles.enderecoItemTxt} numberOfLines={2}>📍 {end}</Text>
                  <TouchableOpacity onPress={() => removerEndereco(i)}>
                    <Text style={styles.removerTxt}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => { setModalEnderecos(false); setModalNovoEndereco(true); }}
            >
              <Text style={styles.addBtnTxt}>+ Adicionar novo endereço</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fechar} onPress={() => setModalEnderecos(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Novo Endereço */}
      <Modal visible={modalNovoEndereco} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>📍 Novo endereço</Text>
            <TextInput
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
              value={novoEndereco}
              onChangeText={setNovoEndereco}
              placeholder="Ex: Rua das Flores, 123 — Apto 45, Centro, SP"
              multiline
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.modalBtn} onPress={adicionarEndereco}>
              <Text style={styles.modalBtnTxt}>Salvar endereço</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fechar} onPress={() => setModalNovoEndereco(false)}>
              <Text style={styles.fecharTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pagamentos */}
      <Modal visible={modalPagamento} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>💳 Formas de pagamento</Text>
            {['💳 Cartão de crédito', '💳 Cartão de débito', '📱 Pix', '💵 Dinheiro na entrega'].map(p => (
              <View key={p} style={styles.pagItem}>
                <Text style={styles.pagTxt}>{p}</Text>
                <Text style={{ color: colors.success, fontSize: 16 }}>✓</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnTxt}>+ Adicionar novo cartão</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fechar} onPress={() => setModalPagamento(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notificações */}
      <Modal visible={modalNotif} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>🔔 Notificações</Text>
            <TouchableOpacity style={styles.notifItem} onPress={() => setNotifPedidos(!notifPedidos)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifLabel}>Status dos pedidos</Text>
                <Text style={styles.notifSub}>Atualizações sobre seu pedido</Text>
              </View>
              <View style={[styles.toggle, notifPedidos && styles.toggleAtivo]}>
                <View style={[styles.toggleCircle, notifPedidos && styles.toggleCircleAtivo]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifItem} onPress={() => setNotifPromos(!notifPromos)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifLabel}>Promoções e ofertas</Text>
                <Text style={styles.notifSub}>Cupons e descontos exclusivos</Text>
              </View>
              <View style={[styles.toggle, notifPromos && styles.toggleAtivo]}>
                <View style={[styles.toggleCircle, notifPromos && styles.toggleCircleAtivo]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fechar} onPress={() => setModalNotif(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ajuda */}
      <Modal visible={modalAjuda} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>❓ Central de ajuda</Text>
            {[
              'Como fazer um pedido?',
              'Como rastrear meu pedido?',
              'Política de cancelamento',
              'Como usar cupons?',
              'Falar com suporte',
            ].map(item => (
              <TouchableOpacity
                key={item}
                style={styles.ajudaItem}
                onPress={() => Alert.alert(item, 'Em breve disponível!')}
              >
                <Text style={styles.ajudaTxt}>{item}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.fechar} onPress={() => setModalAjuda(false)}>
              <Text style={styles.fecharTxt}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>{nomeExibido.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.nome}>{nomeExibido}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        {usuario.metodo && usuario.metodo !== 'email' && (
          <View style={styles.metodoBadge}>
            <Text style={styles.metodoTxt}>
              {usuario.metodo === 'google' ? '🔵 Google' : '🔷 Facebook'}
            </Text>
          </View>
        )}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{enderecos.length}</Text>
            <Text style={styles.statLabel}>Endereços</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>4.9</Text>
            <Text style={styles.statLabel}>Avaliação</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.secTitulo}>Minha conta</Text>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.sairBtn} onPress={handleSair}>
          <Text style={styles.sairIcon}>↪</Text>
          <Text style={styles.sairTxt}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centralize: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.dark, paddingTop: 30, paddingBottom: 24, alignItems: 'center' },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.gold, borderWidth: 2.5, borderColor: colors.lightGold, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTxt: { fontSize: 28, fontWeight: 'bold', color: colors.white },
  nome: { fontSize: 20, fontWeight: 'bold', color: colors.white, marginBottom: 4 },
  email: { fontSize: 13, color: colors.lightGold, marginBottom: 8 },
  metodoBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 14 },
  metodoTxt: { fontSize: 12, color: colors.lightGold },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  stat: { alignItems: 'center', paddingHorizontal: 24 },
  statNum: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  statLabel: { fontSize: 11, color: colors.lightGold, marginTop: 2 },
  statDivider: { width: 0.5, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: { flex: 1 },
  bodyContent: { padding: 20 },
  secTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.dark, marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0.5, borderColor: colors.border },
  menuItemLast: { borderBottomWidth: 0 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { fontSize: 18 },
  menuLabel: { fontSize: 14, color: colors.dark },
  chevron: { fontSize: 20, color: colors.gray },
  sairBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, paddingTop: 16, borderTopWidth: 0.5, borderColor: colors.border },
  sairIcon: { fontSize: 18, color: colors.danger },
  sairTxt: { fontSize: 14, color: colors.danger, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.white, borderRadius: 20, padding: 20, margin: 12, paddingBottom: 30 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: colors.dark, marginBottom: 16 },
  inputLabel: { fontSize: 13, color: colors.gray, marginBottom: 4 },
  modalInput: { backgroundColor: colors.lightGray, borderRadius: 10, padding: 12, fontSize: 14, color: colors.dark, marginBottom: 14, borderWidth: 0.5, borderColor: colors.border },
  emailField: { backgroundColor: colors.lightGray, borderRadius: 10, padding: 12, marginBottom: 14 },
  emailTxt: { fontSize: 14, color: colors.dark },
  modalBtn: { backgroundColor: colors.gold, borderRadius: 25, padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 8 },
  btnDisabled: { backgroundColor: 'rgba(200,119,58,0.5)' },
  modalBtnTxt: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
  fechar: { alignItems: 'center', padding: 10 },
  fecharTxt: { color: colors.gray, fontSize: 14 },
  enderecoItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.lightGray, borderRadius: 10, padding: 12, marginBottom: 8 },
  enderecoItemTxt: { fontSize: 13, color: colors.dark, flex: 1, marginRight: 8 },
  removerTxt: { color: colors.danger, fontSize: 16, fontWeight: 'bold' },
  semEndereco: { color: colors.gray, fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  addBtn: { marginTop: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.gold, borderRadius: 10, borderStyle: 'dashed' },
  addBtnTxt: { color: colors.gold, fontWeight: '500' },
  pagItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderColor: colors.border },
  pagTxt: { fontSize: 14, color: colors.dark },
  notifItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderColor: colors.border },
  notifLabel: { fontSize: 14, color: colors.dark, fontWeight: '500' },
  notifSub: { fontSize: 12, color: colors.gray, marginTop: 2 },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: colors.lightGray, padding: 2 },
  toggleAtivo: { backgroundColor: colors.gold },
  toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white },
  toggleCircleAtivo: { transform: [{ translateX: 20 }] },
  ajudaItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderColor: colors.border },
  ajudaTxt: { fontSize: 14, color: colors.dark },
});