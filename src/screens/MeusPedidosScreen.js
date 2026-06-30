import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert
} from 'react-native';
import { colors } from '../theme/colors';
import PedidoCard from '../components/PedidoCard';

const PEDIDOS_ATIVOS = [
  { id: '1', numero: 'CG-3847', itens: 'Caffe Mocha + Croissant', cafeteria: 'Aurora Cafe', total: '34.00', status: 'A caminho' },
];

const PEDIDOS_HISTORICO = [
  { id: '2', numero: 'CG-3821', itens: 'Flat White', cafeteria: 'Aurora Cafe', total: '18.00', status: 'Entregue', data: '28/05' },
  { id: '3', numero: 'CG-3810', itens: 'Latte Art + Machiato', cafeteria: 'Bistro Paulista', total: '36.00', status: 'Entregue', data: '25/05' },
  { id: '4', numero: 'CG-3798', itens: 'Cappuccino', cafeteria: 'Aurora Cafe', total: '19.00', status: 'Entregue', data: '22/05' },
];

export default function MeusPedidosScreen({ navigation }) {
  const [aba, setAba] = useState('Ativos');
  const dados = aba === 'Ativos' ? PEDIDOS_ATIVOS : PEDIDOS_HISTORICO;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Meus pedidos</Text>
      </View>

      <View style={styles.tabRow}>
        {['Ativos', 'Histórico'].map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, aba === a && styles.tabAtivo]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.tabTxt, aba === a && styles.tabTxtAtivo]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={dados}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <PedidoCard
            pedido={item}
            onRastrear={() => navigation.navigate('Delivery')}
            onPedirNovamente={() => Alert.alert('✅', `${item.itens} adicionado ao novo pedido!`)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum pedido {aba === 'Ativos' ? 'ativo' : 'no histórico'}.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderBottomWidth: 0.5, borderColor: colors.border, backgroundColor: colors.cream, position: 'relative' },
  backBtn: { position: 'absolute', left: 14, width: 32, height: 32, backgroundColor: colors.lightGray, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 18, color: colors.medium },
  titulo: { fontSize: 16, fontWeight: 'bold', color: colors.dark },
  tabRow: { flexDirection: 'row', margin: 16, backgroundColor: colors.lightGray, borderRadius: 24, padding: 3 },
  tab: { flex: 1, padding: 10, borderRadius: 22, alignItems: 'center' },
  tabAtivo: { backgroundColor: colors.gold },
  tabTxt: { fontSize: 13, fontWeight: '500', color: colors.gray },
  tabTxtAtivo: { color: colors.white },
  lista: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { textAlign: 'center', color: colors.gray, marginTop: 40, fontSize: 14 },
});