import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/styles';
import { listarPlantas, gerarGuiaIA } from '../services/api';

export default function IAScreen() {
  const [plantas, setPlantas] = useState([]);
  const [dicaGerada, setDicaGerada] = useState('');
  const [plantaSelecionada, setPlantaSelecionada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState('');

  const carregarPlantas = useCallback(async () => {
    try {
      const lista = await listarPlantas();
      setPlantas(lista);
      setErroCarregamento('');
    } catch (erro) {
      setErroCarregamento(erro.message || 'Não foi possível carregar as plantas.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPlantas();
    }, [carregarPlantas])
  );

  async function pedirDicas(planta) {
    setCarregando(true);
    setPlantaSelecionada(planta.nome);
    setDicaGerada('');

    try {
      const resposta = await gerarGuiaIA(planta._id);
      setDicaGerada(resposta.dicas);
    } catch (erro) {
      Alert.alert(
        'Erro',
        erro.message || 'Não foi possível gerar as dicas. Verifique o servidor.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Guia Inteligente 🤖</Text>
        <Text style={styles.headerSubtitulo}>
          Toque em uma planta para ver luz, rega e adubação
        </Text>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.tituloSecao}>Escolha uma planta cadastrada:</Text>

        {plantas.length === 0 ? (
          <Text style={{ color: '#666', textAlign: 'center', marginVertical: 20 }}>
            {erroCarregamento || 'Cadastre uma planta primeiro para consultar a IA.'}
          </Text>
        ) : (
          plantas.map((planta) => (
            <View key={planta._id} style={styles.card}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#222' }}>
                🌿 {planta.nome}
              </Text>
              <TouchableOpacity
                style={styles.botaoVerde}
                onPress={() => pedirDicas(planta)}
              >
                <Text style={styles.textoBotao}>✨ Gerar Guia de Cuidados</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Mostra o carregando ou a resposta do Gemini */}
        {carregando && (
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
              Consultando especialista para {plantaSelecionada}...
            </Text>
          </View>
        )}

        {dicaGerada !== '' && (
          <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: '#2E7D32' }]}>
            <Text style={styles.tituloSecao}>🌱 Cuidados: {plantaSelecionada}</Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: '#333' }}>
              {dicaGerada}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
