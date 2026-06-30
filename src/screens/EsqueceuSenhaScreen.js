import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, ImageBackground,
  Image, Modal
} from 'react-native';
import { colors } from '../theme/colors';

export default function EsqueceuSenhaScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleEnviar() {
    if (!email.includes('@') || !email.includes('.')) {
      return;
    }
    setEnviado(true);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/splash_bg.jpg')}
        style={styles.bgImage}
        resizeMode="cover"
        blurRadius={8}
      >
        <View style={styles.overlay} />

        {/* Confirmação enviado */}
        <Modal visible={enviado} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalEmoji}>📧</Text>
              <Text style={styles.modalTitulo}>E-mail enviado!</Text>
              <Text style={styles.modalSub}>
                Enviamos um link de redefinição para{'\n'}
                <Text style={styles.modalEmail}>{email}</Text>
                {'\n\n'}
                Acesse seu e-mail, clique no link recebido e crie uma nova senha.
                O link expira em 30 minutos.
              </Text>
              <View style={styles.modalDica}>
                <Text style={styles.modalDicaTxt}>
                  💡 Não encontrou? Verifique a pasta de spam ou lixo eletrônico.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => { setEnviado(false); navigation.navigate('Login'); }}
              >
                <Text style={styles.modalBtnTxt}>Voltar para o login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔒</Text>
          </View>
          <Text style={styles.titulo}>Esqueceu a senha?</Text>
          <Text style={styles.subtitulo}>
            Informe seu e-mail cadastrado e enviaremos um link para criar uma nova senha
          </Text>

          <Text style={styles.label}>E-mail cadastrado</Text>
          <TextInput
            style={[styles.input, !email.includes('@') && email.length > 0 && styles.inputErro]}
            placeholder="maria@email.com"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {!email.includes('@') && email.length > 0 && (
            <Text style={styles.erroTxt}>Informe um e-mail válido</Text>
          )}

          <TouchableOpacity
            style={[styles.botao, (!email.includes('@') || !email.includes('.')) && styles.botaoDisabled]}
            onPress={handleEnviar}
            disabled={!email.includes('@') || !email.includes('.')}
          >
            <Text style={styles.botaoTxt}>Enviar link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.voltarTxt}>
              Lembrou a senha? <Text style={styles.voltarLink}>Voltar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,8,2,0.78)' },
  content: { flex: 1, justifyContent: 'center', padding: 28 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(200,119,58,0.2)',
    borderWidth: 1, borderColor: 'rgba(200,119,58,0.4)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 20,
  },
  icon: { fontSize: 28 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: colors.white, textAlign: 'center', marginBottom: 10 },
  subtitulo: { fontSize: 14, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  label: { fontSize: 13, color: colors.lightGold, fontWeight: '500', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.5, borderColor: 'rgba(200,119,58,0.4)',
    borderRadius: 10, padding: 14, fontSize: 15,
    color: colors.white, marginBottom: 6,
  },
  inputErro: { borderColor: '#ff6b6b' },
  erroTxt: { color: '#ff6b6b', fontSize: 12, marginBottom: 10 },
  botao: { backgroundColor: colors.gold, borderRadius: 30, padding: 16, alignItems: 'center', marginTop: 10, marginBottom: 16 },
  botaoDisabled: { backgroundColor: 'rgba(200,119,58,0.4)' },
  botaoTxt: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  voltarBtn: { alignItems: 'center' },
  voltarTxt: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  voltarLink: { color: colors.lightGold, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { backgroundColor: colors.white, borderRadius: 20, padding: 28, alignItems: 'center', width: '100%' },
  modalEmoji: { fontSize: 48, marginBottom: 12 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: colors.dark, marginBottom: 8 },
  modalSub: { fontSize: 14, color: colors.gray, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  modalEmail: { color: colors.gold, fontWeight: 'bold' },
  modalDica: { backgroundColor: colors.lightGray, borderRadius: 10, padding: 12, marginBottom: 20, width: '100%' },
  modalDicaTxt: { fontSize: 12, color: colors.gray, lineHeight: 18 },
  modalBtn: { backgroundColor: colors.gold, borderRadius: 25, paddingHorizontal: 24, paddingVertical: 12 },
  modalBtnTxt: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
});