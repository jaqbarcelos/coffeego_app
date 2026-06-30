import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const statusConfig = {
  'A caminho': { bg: colors.successBg, color: colors.success },
  'Entregue': { bg: colors.lightGray, color: colors.gray },
  'Em preparo': { bg: '#fff8e1', color: '#f57f17' },
  'Confirmado': { bg: '#e3f2fd', color: '#1565c0' },
};

export default function PedidoCard({ pedido, onRastrear, onPedirNovamente }) {
  const { numero, itens, cafeteria, total, status, data } = pedido;
  const statusStyle = statusConfig[status] || statusConfig['Entregue'];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.numero}>Pedido #{numero}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusTxt, { color: statusStyle.color }]}>{status}</Text>
        </View>
      </View>
      <View style={styles.itemRow}>
        <View style={styles.itemThumb}>
          <Text style={{ fontSize: 16 }}>🖼</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{itens}</Text>
          <Text style={styles.itemCafe}>{cafeteria}{data ? ` • ${data}` : ''}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.total}>Total: <Text style={styles.totalVal}>R$ {total}</Text></Text>
        {status === 'A caminho' ? (
          <TouchableOpacity style={styles.btnPrimary} onPress={onRastrear}>
            <Text style={styles.btnPrimaryTxt}>Rastrear</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnSecondary} onPress={onPedirNovamente}>
            <Text style={styles.btnSecondaryTxt}>Pedir de novo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  numero: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusTxt: { fontSize: 11, fontWeight: '500' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  itemThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 12, fontWeight: '500', color: colors.dark },
  itemCafe: { fontSize: 11, color: colors.gray },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { fontSize: 12, color: colors.gray },
  totalVal: { fontWeight: 'bold', color: colors.dark },
  btnPrimary: { backgroundColor: colors.gold, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  btnPrimaryTxt: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  btnSecondary: { backgroundColor: colors.lightGray, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  btnSecondaryTxt: { color: colors.medium, fontSize: 12, fontWeight: '500' },
});