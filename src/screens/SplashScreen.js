import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, Image, StatusBar
} from 'react-native';
import { colors } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/splash_bg.jpg')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <Image
            source={require('../../assets/logo_horizontal_clara.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.titulo}>
            O melhor do café,{'\n'}na palma da sua mão
          </Text>
          <Text style={styles.subtitulo}>
            Bem-vindo(a) ao CoffeeGo, onde cada xícara é feita para ser apreciada
          </Text>

          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.botaoTxt}>Iniciar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(28,15,7,0.55)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  logo: {
    width: 160,
    height: 80,
    alignSelf: 'center',
    marginBottom: 28,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 32,
    lineHeight: 22,
  },
  botao: {
    backgroundColor: colors.gold,
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  botaoTxt: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});