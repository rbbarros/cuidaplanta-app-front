import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/styles';
import { listarPlantas, marcarRega, removerPlanta } from '../services/api';

export default function ListaScreen({ navigation }) {
  const [plantas, setPlantas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      const lista = await listarPlantas();
      setPlantas(lista);
    } catch (erro) {
      console.log('Erro ao listar:', erro.message);
    }
  }

  function textoProximaRega(ultimaRega, intervaloDias) {
    if (!intervaloDias) return 'Intervalo de rega não definido';

    const dataUltima = new Date(ultimaRega);
    const dataProxima = new Date(dataUltima);
    dataProxima.setDate(dataUltima.getDate() + Number(intervaloDias));

    const hoje = new Date();
    const diferencaTempo = dataProxima - hoje;
    const diasFaltando = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    if (diasFaltando < 0) return '⚠️ Rega atrasada!';
    if (diasFaltando === 0) return '💧 Regar hoje!';
    if (diasFaltando === 1) return '💧 Regar amanhã';
    return `💧 Próxima rega em ${diasFaltando} dias`;
  }

  async function handleRegar(id) {
    await marcarRega(id);
    Alert.alert('Sucesso', 'Rega de hoje registrada!');
    carregarDados();
  }

  async function handleExcluir(id) {
    await removerPlanta(id);
    carregarDados();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.conteudo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.tituloSecao}>🌿 Minhas Plantas</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#2E7D32', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
            onPress={() => navigation.navigate('Formulario')}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+ Nova Planta</Text>
          </TouchableOpacity>
        </View>

        {plantas.length === 0 ? (
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🪴</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1B5E20', textAlign: 'center' }}>
              Sua estante está vazia!
            </Text>
            <Text style={{ color: '#555', textAlign: 'center', marginTop: 6, marginBottom: 16 }}>
              Que tal cadastrar a sua primeira plantinha para acompanhar a rega e os cuidados?
            </Text>
            <TouchableOpacity
              style={[styles.botaoVerde, { width: '100%' }]}
              onPress={() => navigation.navigate('Formulario')}
            >
              <Text style={styles.textoBotao}>+ Cadastrar Planta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          plantas.map((planta) => (
            <View key={planta._id} style={styles.card}>
              {planta.foto ? (
                <Image source={{ uri: planta.foto }} style={styles.imagemCard} />
              ) : null}

              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222' }}>
                {planta.nome}
              </Text>
              <Text style={{ color: '#555', marginTop: 2 }}>
                📍 Cômodo: {planta.comodo || 'Não informado'}
              </Text>
              <Text style={{ color: '#0277BD', fontWeight: 'bold', marginTop: 6 }}>
                {textoProximaRega(planta.ultimaRega, planta.intervaloRegaDias)}
              </Text>

              <TouchableOpacity
                style={styles.botaoRegar}
                onPress={() => handleRegar(planta._id)}
              >
                <Text style={styles.textoBotao}>💧 Reguei hoje</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 10, alignItems: 'center' }}
                onPress={() => handleExcluir(planta._id)}
              >
                <Text style={{ color: '#D32F2F', fontSize: 13 }}>Excluir planta</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
