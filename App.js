import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'; // Para botões com gradiente
import { FontAwesome5 } from '@expo/vector-icons'; // Para ícones nos botões

// Função para gerar um número aleatório entre 1 e 100
const gerarNumeroAleatorio = () => Math.floor(Math.random() * 100) + 1;

export default function App() {
  const [numeroSecreto, setNumeroSecreto] = useState(gerarNumeroAleatorio());
  const [palpite, setPalpite] = useState('');
  const [mensagem, setMensagem] = useState('Adivinhe um número entre 1 e 100!');
  const [tentativas, setTentativas] = useState(0);
  const [feedbackCor, setFeedbackCor] = useState('#333'); // Cor padrão para o feedback

  // Valores compartilhados para animações
  const messageScale = useSharedValue(1);
  const messageOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1); // Para animação de clique do botão

  // Estilo animado para a mensagem de feedback
  const animatedMessageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: messageScale.value }],
      opacity: messageOpacity.value,
    };
  });

  // Estilo animado para o botão de verificar palpite
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  // Efeito para animar a mensagem sempre que ela muda
  useEffect(() => {
    messageOpacity.value = 0; // Reseta a opacidade
    messageScale.value = 0.8; // Começa menor
    messageOpacity.value = withTiming(1, { duration: 300 }); // Fade-in
    messageScale.value = withSpring(1); // "Pulo" animado
  }, [mensagem]);

  function verificarPalpite() {
    const palpiteNumerico = parseInt(palpite);

    if (isNaN(palpiteNumerico) || palpiteNumerico < 1 || palpiteNumerico > 100) {
      Alert.alert('Ops!', 'Por favor, insira um número válido entre 1 e 100.');
      return;
    }

    setTentativas(tentativas + 1);

    if (palpiteNumerico === numeroSecreto) {
      setMensagem(`Parabéns! Você acertou o número ${numeroSecreto} em ${tentativas + 1} tentativas!`);
      setFeedbackCor('#28a745'); // Verde para acerto
    } else if (palpiteNumerico < numeroSecreto) {
      setMensagem('É maior! Tente novamente.');
      setFeedbackCor('#007bff'); // Azul para dica de "maior"
    } else {
      setMensagem('É menor! Tente novamente.');
      setFeedbackCor('#dc3545'); // Vermelho para dica de "menor"
    }
  }

  function reiniciarJogo() {
    setNumeroSecreto(gerarNumeroAleatorio());
    setPalpite('');
    setMensagem('Adivinhe um número entre 1 e 100!');
    setTentativas(0);
    setFeedbackCor('#333'); // Reseta a cor
  }

  // Funções para animação de clique do botão
  const onPressInButton = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOutButton = () => {
    buttonScale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Jogo de Adivinhação</Text>
      <Text style={styles.textoExplicativo}>
        Pensei em um número entre 1 e 100. Tente adivinhar!
      </Text>

      <Animated.View style={[styles.feedbackContainer, { borderColor: feedbackCor }, animatedMessageStyle]}>
        <Text style={[styles.instrucao, { color: feedbackCor }]}>{mensagem}</Text>
      </Animated.View>

      <TextInput
        style={styles.input}
        placeholder="Digite seu palpite"
        keyboardType="numeric"
        value={palpite}
        onChangeText={setPalpite}
        placeholderTextColor="#888"
        editable={!mensagem.includes('Parabéns')}
      />

      <TouchableOpacity
        onPress={verificarPalpite}
        onPressIn={onPressInButton}
        onPressOut={onPressOutButton}
        style={styles.buttonContainer}
        disabled={mensagem.includes('Parabéns')}
      >
        <Animated.View style={[styles.animatedButtonInner, animatedButtonStyle]}>
          <LinearGradient
            colors={['#007bff', '#0056b3']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <FontAwesome5 name="question-circle" size={18} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Verificar Palpite</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {mensagem.includes('Parabéns') && (
        <TouchableOpacity
          onPress={reiniciarJogo}
          onPressIn={onPressInButton}
          onPressOut={onPressOutButton}
          style={styles.buttonContainer}
        >
          <Animated.View style={[styles.animatedButtonInner, animatedButtonStyle]}>
            <LinearGradient
              colors={['#f44336', '#d32f2f']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <FontAwesome5 name="redo-alt" size={18} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Reiniciar Jogo</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      )}

      {tentativas > 0 && !mensagem.includes('Parabéns') && (
        <Text style={styles.contadorTentativas}>Tentativas: {tentativas}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0056b3',
    marginBottom: 10,
    textAlign: 'center',
  },
  textoExplicativo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    lineHeight: 24,
  },
  feedbackContainer: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 80, // Garante espaço para a mensagem animar
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  instrucao: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 55,
    borderColor: '#b0d4f3',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 25,
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#333',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonContainer: {
    width: '90%',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden', // Importante para o gradiente
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  animatedButtonInner: {
    // Para aplicar a animação de escala diretamente no conteúdo do botão
    width: '100%',
    height: '100%',
  },
  buttonGradient: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '600',
  },
  contadorTentativas: {
    marginTop: 20,
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },
});