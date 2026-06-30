import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar,
  ImageBackground, Image, Modal, ActivityIndicator
} from 'react-native';
import { colors } from '../theme/colors';

const API_URL = 'https://6a1f1c50b79eec0d6cf085af.mockapi.io/usuarios';

export default function CadastroScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', senha: '', confirmarSenha: ''
  });
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = useCallback((campo, valor) => {
    setForm(f => ({ ...f, [campo]: valor }));
    setErros(e => ({ ...e, [campo]: '' }));
  }, []);

  function validar() {
    const novosErros = {};
    if (!form.nome.trim() || form.nome.trim().split(' ').length < 2)
      novosErros.nome = 'Informe nome e sobrenome.';
    if (!form.email.includes('@') || !form.email.includes('.'))
      novosErros.email = 'E-mail inválido.';
    if (form.telefone.replace(/\D/g, '').length < 10)
      novosErros.telefone = 'Telefone inválido. Inclua o DDD.';
    if (form.senha.length < 6)
      novosErros.senha = 'Mínimo 6 caracteres.';
    if (form.senha !== form.confirmarSenha)
      novosErros.confirmarSenha = 'As senhas não coincidem.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleCadastro() {
    if (!validar()) return;
    setCarregando(true);
    try {
      const check = await fetch(
        `${API_URL}?email=${encodeURIComponent(form.email.trim().toLowerCase())}`
      );
      const existentes = await check.json();
      if (existentes.length > 0) {
        setErros({ email: 'Este e-mail já está cadastrado.' });
        setCarregando(false);
        return;
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim().toLowerCase(),
          telefone: form.telefone,
          senha: form.senha,
          enderecos: '[]',
        }),
      });

      if (res.ok) {
        setSucesso(true);
        setTimeout(() => {
          setSucesso(false);
          navigation.navigate('Login');
        }, 3000);
      }
    } catch {
      setErros({ geral: 'Erro de conexão. Verifique sua internet.' });
    } finally {
      setCarregando(false);
    }
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

        <Modal visible={sucesso} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalEmoji}>✅</Text>
              <Text style={styles.modalTitulo}>Cadastro realizado!</Text>
              <Text style={styles.modalSub}>
                Bem-vindo(a) ao CoffeeGo!{'\n'}Redirecionando para o login...
              </Text>
              <ActivityIndicator color={colors.gold} style={{ marginVertical: 12 }} />
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => { setSucesso(false); navigation.navigate('Login'); }}
              >
                <Text style={styles.modalBtnTxt}>Ir para o login agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <Image
            source={require('../../assets/logo_vertical_clara.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.titulo}>Criar conta</Text>

          {erros.geral ? (
            <View style={styles.erroGeralBox}>
              <Text style={styles.erroGeralTxt}>⚠️ {erros.geral}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Nome completo *</Text>
          <TextInput
            style={[styles.input, erros.nome && styles.inputErro]}
            placeholder="Maria Silva"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={form.nome}
            onChangeText={t => handleChange('nome', t)}
            autoCapitalize="words"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {erros.nome ? <Text style={styles.erroTxt}>⚠️ {erros.nome}</Text> : null}

          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={[styles.input, erros.email && styles.inputErro]}
            placeholder="maria@email.com"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={form.email}
            onChangeText={t => handleChange('email', t)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {erros.email ? <Text style={styles.erroTxt}>⚠️ {erros.email}</Text> : null}

          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={[styles.input, erros.telefone && styles.inputErro]}
            placeholder="11 99999-9999"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={form.telefone}
            onChangeText={t => handleChange('telefone', t)}
            keyboardType="phone-pad"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {erros.telefone ? <Text style={styles.erroTxt}>⚠️ {erros.telefone}</Text> : null}

          <Text style={styles.label}>Senha * (mín. 6 dígitos)</Text>
          <TextInput
            style={[styles.input, erros.senha && styles.inputErro]}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={form.senha}
            onChangeText={t => handleChange('senha', t)}
            secureTextEntry
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          {erros.senha ? <Text style={styles.erroTxt}>⚠️ {erros.senha}</Text> : null}

          <Text style={styles.label}>Confirmar senha *</Text>
          <TextInput
            style={[styles.input, erros.confirmarSenha && styles.inputErro]}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={form.confirmarSenha}
            onChangeText={t => handleChange('confirmarSenha', t)}
            secureTextEntry
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="done"
          />
          {erros.confirmarSenha ? <Text style={styles.erroTxt}>⚠️ {erros.confirmarSenha}</Text> : null}

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDisabled]}
            onPress={handleCadastro}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.botaoTxt}>Cadastrar</Text>
            }
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginTxt}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,8,2,0.75)' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { width: 160, height: 80, alignSelf: 'center', marginBottom: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: colors.white, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 13, color: colors.lightGold, fontWeight: '500', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.5, borderColor: 'rgba(200,119,58,0.4)',
    borderRadius: 10, padding: 14, fontSize: 15,
    color: colors.white, marginBottom: 4,
  },
  inputErro: { borderColor: '#ff6b6b', borderWidth: 1 },
  erroTxt: { color: '#ff6b6b', fontSize: 12, marginBottom: 10 },
  erroGeralBox: { backgroundColor: 'rgba(255,107,107,0.15)', borderRadius: 8, padding: 10, marginBottom: 12, borderWidth: 0.5, borderColor: '#ff6b6b' },
  erroGeralTxt: { color: '#ff6b6b', fontSize: 13, textAlign: 'center' },
  botao: { backgroundColor: colors.gold, borderRadius: 30, padding: 16, alignItems: 'center', marginTop: 12, marginBottom: 16 },
  botaoDisabled: { backgroundColor: 'rgba(200,119,58,0.5)' },
  botaoTxt: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginTxt: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  loginLink: { color: colors.lightGold, fontSize: 13, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { backgroundColor: colors.white, borderRadius: 20, padding: 28, alignItems: 'center', width: '100%' },
  modalEmoji: { fontSize: 48, marginBottom: 12 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: colors.dark, marginBottom: 8 },
  modalSub: { fontSize: 14, color: colors.gray, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  modalBtn: { backgroundColor: colors.gold, borderRadius: 25, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  modalBtnTxt: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
});