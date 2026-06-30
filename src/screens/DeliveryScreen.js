import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated
} from 'react-native';
import { colors } from '../theme/colors';

const ETAPAS = [
  { id: 1, nome: 'Pedido confirmado', hora: '14:32 — Hoje', desc: '', status: 'done' },
  { id: 2, nome: 'Em preparo', hora: '14:35 — Hoje', desc: 'Aurora Cafe está preparando seu pedido', status: 'done' },
  { id: 3, nome: 'A caminho', hora: '14:48 — Agora', desc: 'Carlos está a 1,2 km de você', status: 'active' },
  { id: 4, nome: 'Entregue', hora: 'Previsão: ~14:56', desc: '', status: 'pending' },
];

export default function DeliveryScreen({ navigation }) {
  const posX = useRef(new Animated.Value(20)).current;
  const posY = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    // Animação no mapa
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(posX, { toValue: 80, duration: 2000, useNativeDriver: false }),
          Animated.timing(posY, { toValue: 80, duration: 2000, useNativeDriver: false }),
        ]),
        Animated.parallel([
          Animated.timing(posX, { toValue: 80, duration: 1500, useNativeDriver: false }),
          Animated.timing(posY, { toValue: 40, duration: 1500, useNativeDriver: false }),
        ]),
        Animated.parallel([
          Animated.timing(posX, { toValue: 140, duration: 2000, useNativeDriver: false }),
          Animated.timing(posY, { toValue: 20, duration: 2000, useNativeDriver: false }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>Acompanhar pedido</Text>
          <Text style={styles.numeroPedido}>Pedido #AU-2847</Text>
        </View>
      </View>

      <View style={styles.mapaArea}>
        {/* Mapa fictício */}
        <View style={styles.mapa}>
          {/* Ruas horizontais */}
          <View style={[styles.rua, { top: 40, left: 0, right: 0, height: 6 }]} />
          <View style={[styles.rua, { top: 90, left: 0, right: 0, height: 5 }]} />
          <View style={[styles.rua, { top: 130, left: 0, right: 0, height: 5 }]} />
          {/* Ruas verticais */}
          <View style={[styles.rua, { left: 80, top: 0, bottom: 0, width: 7 }]} />
          <View style={[styles.rua, { left: 160, top: 0, bottom: 0, width: 5 }]} />
          {/* Blocos/quarteirões */}
          <View style={[styles.bloco, { top: 8, left: 8, width: 62, height: 24 }]} />
          <View style={[styles.bloco, { top: 8, left: 90, width: 60, height: 24 }]} />
          <View style={[styles.bloco, { top: 50, left: 8, width: 62, height: 32 }]} />
          <View style={[styles.bloco, { top: 50, left: 90, width: 60, height: 32 }]} />
          <View style={[styles.bloco, { top: 100, left: 8, width: 62, height: 26 }]} />
          <View style={[styles.bloco, { top: 100, left: 90, width: 60, height: 26 }]} />
          {/* Destino */}
          <View style={styles.pinDestino}>
            <Text style={styles.pinTxt}>☕</Text>
          </View>
          {/* Entregador */}
          <Animated.View style={[styles.entregador, { left: posX, top: posY }]}>
            <Text style={styles.entregadorTxt}>▲</Text>
          </Animated.View>
        </View>
        <View style={styles.etaBadge}>
          <Text style={styles.etaTxt}>Chega em ~8 min</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.secTitulo}>Status do pedido</Text>
        {ETAPAS.map((etapa, index) => (
          <View key={etapa.id} style={styles.tlItem}>
            <View style={styles.tlLeft}>
              <View style={[styles.tlDot, styles[`tlDot_${etapa.status}`]]}>
                <Text style={styles.tlDotTxt}>
                  {etapa.status === 'done' ? '✓' : etapa.status === 'active' ? '🚴' : '🏠'}
                </Text>
              </View>
              {index < ETAPAS.length - 1 && (
                <View style={[styles.tlLinha, etapa.status === 'done' ? styles.tlLinhaDone : styles.tlLinhaPend]} />
              )}
            </View>
            <View style={styles.tlContent}>
              <Text style={[styles.tlNome, etapa.status === 'pending' && styles.tlNomePend]}>{etapa.nome}</Text>
              <Text style={[styles.tlHora, etapa.status === 'pending' && styles.tlHoraPend]}>{etapa.hora}</Text>
              {etapa.desc ? <Text style={styles.tlDesc}>{etapa.desc}</Text> : null}
            </View>
          </View>
        ))}

        <View style={styles.entregadorCard}>
          <View style={styles.entregadorAvatar}>
            <Text style={styles.entregadorAvatarTxt}>C</Text>
          </View>
          <View style={styles.entregadorInfo}>
            <Text style={styles.entregadorNome}>Carlos Silva</Text>
            <Text style={styles.entregadorSub}>MUS-0379 • Honda CG</Text>
          </View>
          <TouchableOpacity style={styles.ligarBtn}>
            <Text style={styles.ligarTxt}>📞 Ligar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.dark, padding: 14, paddingTop: 16 },
  backBtn: { width: 30, height: 30, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 18, color: colors.white },
  titulo: { fontSize: 16, fontWeight: 'bold', color: colors.white },
  numeroPedido: { fontSize: 11, color: colors.lightGold },
  mapaArea: { height: 170, position: 'relative' },
  mapa: { flex: 1, backgroundColor: '#e8dfc8', overflow: 'hidden' },
  rua: { position: 'absolute', backgroundColor: '#c4b48a' },
  bloco: { position: 'absolute', backgroundColor: '#d8cfa8', borderRadius: 4 },
  pinDestino: { position: 'absolute', top: 8, right: 20, width: 28, height: 28, backgroundColor: colors.dark, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pinTxt: { fontSize: 14 },
  entregador: { position: 'absolute', width: 22, height: 22, backgroundColor: colors.gold, borderRadius: 11, borderWidth: 2, borderColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  entregadorTxt: { fontSize: 10, color: colors.dark },
  etaBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: colors.dark, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14 },
  etaTxt: { color: colors.lightGold, fontSize: 11, fontWeight: '500' },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 24 },
  secTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.dark, marginBottom: 14 },
  tlItem: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  tlLeft: { alignItems: 'center', width: 22 },
  tlDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  tlDot_done: { backgroundColor: colors.medium },
  tlDot_active: { backgroundColor: colors.gold },
  tlDot_pending: { backgroundColor: colors.lightGray, borderWidth: 0.5, borderColor: colors.border },
  tlDotTxt: { fontSize: 10, color: colors.white },
  tlLinha: { width: 1.5, flex: 1, minHeight: 18, marginVertical: 2 },
  tlLinhaDone: { backgroundColor: colors.medium },
  tlLinhaPend: { backgroundColor: colors.border },
  tlContent: { paddingBottom: 16, flex: 1 },
  tlNome: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  tlNomePend: { color: colors.gray },
  tlHora: { fontSize: 11, color: colors.gold, marginTop: 1 },
  tlHoraPend: { color: colors.gray },
  tlDesc: { fontSize: 11, color: colors.gray, marginTop: 2 },
  entregadorCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 12, marginTop: 8 },
  entregadorAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  entregadorAvatarTxt: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  entregadorInfo: { flex: 1 },
  entregadorNome: { fontSize: 13, fontWeight: 'bold', color: colors.dark },
  entregadorSub: { fontSize: 11, color: colors.gray },
  ligarBtn: { backgroundColor: colors.lightGray, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  ligarTxt: { fontSize: 12, color: colors.medium, fontWeight: '500' },
});