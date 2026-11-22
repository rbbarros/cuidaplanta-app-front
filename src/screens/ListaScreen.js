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

  function textoProximaRega(ultimaRega, intervaloDias, nomePlanta = '') {
    let dias = Number(intervaloDias);

    if (!dias) {
      const n = nomePlanta.toLowerCase();
      if (n.includes('cacto') || n.includes('suculenta') || n.includes('espada')) dias = 14;
      else if (n.includes('orquídea') || n.includes('orquidea')) dias = 7;
      else if (n.includes('samambaia')) dias = 2;
      else dias = 4;
    }

    const dataUltima = new Date(ultimaRega || Date.now());
    const dataProxima = new Date(dataUltima);
    dataProxima.setDate(dataUltima.getDate() + dias);

    const hoje = new Date();
    const diferencaTempo = dataProxima - hoje;
    const diasFaltando = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    if (diasFaltando < 0) return '⚠️ Rega atrasada!';
    if (diasFaltando === 0) return '💧 Regar hoje!';
    if (diasFaltando === 1) return '💧 Regar amanhã';
    return `💧 Próxima rega em ${diasFaltando} dias`;
  }

  async function handleRegar(id) {
    try {
      const plantaAtualizada = await marcarRega(id);

      if (!plantaAtualizada?.ultimaRega) {
        throw new Error('O servidor não retornou a data da rega.');
      }

      setPlantas((listaAtual) =>
        listaAtual.map((planta) =>
          planta._id === id
            ? { ...planta, ultimaRega: plantaAtualizada.ultimaRega }
            : planta
        )
      );
      Alert.alert('Sucesso', 'Rega de hoje registrada!');
    } catch (erro) {
      Alert.alert('Erro', erro.message || 'Não foi possível registrar a rega.');
    }
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
                {textoProximaRega(planta.ultimaRega, planta.intervaloRegaDias, planta.nome)}
              </Text>

              <TouchableOpacity
                style={styles.botaoRegar}
                onPress={() => handleRegar(planta._id)}
              >
                <Text style={styles.textoBotao}>💧 Reguei hoje</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 10, alignItems: 'center' }}
                onPress={() =>
                  navigation.navigate('Formulario', {
                    planta: {
                      _id: planta._id,
                      nome: planta.nome,
                      comodo: planta.comodo,
                      intervaloRegaDias: planta.intervaloRegaDias,
                      temFoto: Boolean(planta.foto),
                    },
                  })
                }
              >
                <Text style={{ color: '#2E7D32', fontSize: 14, fontWeight: 'bold' }}>
                  ✏️ Editar cadastro e dias de rega
                </Text>
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
