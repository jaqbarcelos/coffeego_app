import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, StatusBar, ScrollView,
  ImageBackground, Image, ActivityIndicator
} from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const API_USUARIOS = 'https://6a1f1c50b79eec0d6cf085af.mockapi.io/usuarios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erroLogin, setErroLogin] = useState('');
  const { setUsuarioLogado } = useApp();

  async function handleLogin() {
    setErroLogin('');
    if (!email.trim()) { setErroLogin('Informe seu e-mail.'); return; }
    if (!senha.trim()) { setErroLogin('Informe sua senha.'); return; }
    if (!email.includes('@')) { setErroLogin('E-mail inválido.'); return; }

    setCarregando(true);
    try {
      const res = await fetch(`${API_USUARIOS}?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      const usuarios = await res.json();
      const usuario = usuarios.find(
        u => u.email?.toLowerCase() === email.trim().toLowerCase()
      );

      if (!usuario) {
        setErroLogin('E-mail não cadastrado. Crie uma conta primeiro.');
        setCarregando(false);
        return;
      }
      if (usuario.senha !== senha) {
        setErroLogin('Senha incorreta. Tente novamente.');
        setCarregando(false);
        return;
      }

      setUsuarioLogado({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || '',
        enderecos: usuario.enderecos || '[]',
        metodo: 'email',
      });
      navigation.replace('MainDrawer');
    } catch {
      setErroLogin('Erro de conexão. Verifique sua internet.');
    } finally {
      setCarregando(false);
    }
  }

  // Simulação Google/Facebook 
  function handleGoogleLogin() {
    Alert.alert(
      'Login com Google',
      'Para fins de demonstração, simular login?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Simular', onPress: () => {
            setUsuarioLogado({
              id: 'google_demo',
              nome: 'Usuário Google',
              email: 'usuario@gmail.com',
              metodo: 'google',
              enderecos: '[]',
            });
            navigation.replace('MainDrawer');
          }
        }
      ]
    );
  }

  function handleFacebookLogin() {
    Alert.alert(
      'Login com Facebook',
      'Para fins de demonstração, simular login?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Simular', onPress: () => {
            setUsuarioLogado({
              id: 'facebook_demo',
              nome: 'Usuário Facebook',
              email: 'usuario@facebook.com',
              metodo: 'facebook',
              enderecos: '[]',
            });
            navigation.replace('MainDrawer');
          }
        }
      ]
    );
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/logo_vertical_clara.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.titulo}>Bem-vindo de volta!</Text>

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, erroLogin && styles.inputErro]}
            placeholder="maria@email.com"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={email}
            onChangeText={t => { setEmail(t); setErroLogin(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, erroLogin && styles.inputErro]}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={senha}
            onChangeText={t => { setSenha(t); setErroLogin(''); }}
            secureTextEntry
            autoCorrect={false}
            blurOnSubmit={false}
          />

          {erroLogin ? (
            <View style={styles.erroBox}>
              <Text style={styles.erroTxt}>⚠️ {erroLogin}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.esqueceuBtn}
            onPress={() => navigation.navigate('EsqueceuSenha')}
          >
            <Text style={styles.esqueceuTxt}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDisabled]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.botaoTxt}>Entrar</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerTxt}>ou entre com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtnGoogle} onPress={handleGoogleLogin}>
              <Text style={styles.socialIconG}>G</Text>
              <Text style={styles.socialTxtDark}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtnFB} onPress={handleFacebookLogin}>
              <Text style={styles.socialIconFB}>f</Text>
              <Text style={styles.socialTxtLight}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cadastroRow}>
            <Text style={styles.cadastroTxt}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.cadastroLink}>Cadastre-se</Text>
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
  logo: { width: 160, height: 80, alignSelf: 'center', marginBottom: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: colors.white, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 13, color: colors.lightGold, fontWeight: '500', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.5, borderColor: 'rgba(200,119,58,0.4)',
    borderRadius: 10, padding: 14, fontSize: 15,
    color: colors.white, marginBottom: 10,
  },
  inputErro: { borderColor: '#ff6b6b', borderWidth: 1 },
  erroBox: {
    backgroundColor: 'rgba(255,107,107,0.15)',
    borderRadius: 8, padding: 10,
    borderWidth: 0.5, borderColor: '#ff6b6b', marginBottom: 12,
  },
  erroTxt: { color: '#ff6b6b', fontSize: 13, textAlign: 'center' },
  esqueceuBtn: { alignSelf: 'flex-end', marginBottom: 18 },
  esqueceuTxt: { color: colors.lightGold, fontSize: 13 },
  botao: { backgroundColor: colors.gold, borderRadius: 30, padding: 16, alignItems: 'center', marginBottom: 16 },
  botaoDisabled: { backgroundColor: 'rgba(200,119,58,0.5)' },
  botaoTxt: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerTxt: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 20 },
  socialBtnGoogle: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  socialBtnFB: {
    flex: 1, backgroundColor: '#1877F2',
    borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  socialIconG: { color: '#DB4437', fontSize: 16, fontWeight: 'bold' },
  socialIconFB: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  socialTxtDark: { fontSize: 13, fontWeight: '600', color: colors.dark },
  socialTxtLight: { fontSize: 13, fontWeight: '600', color: colors.white },
  cadastroRow: { flexDirection: 'row', justifyContent: 'center' },
  cadastroTxt: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  cadastroLink: { color: colors.lightGold, fontSize: 13, fontWeight: '500' },
});