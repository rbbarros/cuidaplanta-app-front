import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../styles/styles';
import { atualizarPlanta, criarPlanta } from '../services/api';

export default function FormularioScreen({ navigation, route }) {
  const plantaEdicao = route.params?.planta;
  const [nome, setNome] = useState(plantaEdicao?.nome || '');
  const [comodo, setComodo] = useState(plantaEdicao?.comodo || '');
  const [intervaloRegaDias, setIntervaloRegaDias] = useState(
    plantaEdicao?.intervaloRegaDias ? String(plantaEdicao.intervaloRegaDias) : ''
  );
  const [foto, setFoto] = useState(null);

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão', 'Precisamos de acesso à câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.3,
    });

    if (!resultado.canceled) {
      setFoto(`data:image/jpeg;base64,${resultado.assets.at(0).base64}`);
    }
  }

  async function salvarPlanta() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome da planta!');
      return;
    }

    const intervalo = intervaloRegaDias.trim() ? Number(intervaloRegaDias) : null;
    if (intervalo !== null && (!Number.isInteger(intervalo) || intervalo < 1)) {
      Alert.alert('Atenção', 'Informe um intervalo de rega em dias inteiros, maior que zero.');
      return;
    }

    if (plantaEdicao && intervalo === null) {
      Alert.alert('Atenção', 'Informe os dias de rega recomendados no Guia IA.');
      return;
    }

    try {
      const dadosPlanta = {
        nome: nome.trim(),
        comodo: comodo.trim(),
        intervaloRegaDias: intervalo,
      };

      if (foto) {
        dadosPlanta.foto = foto;
      }

      if (plantaEdicao) {
        await atualizarPlanta(plantaEdicao._id, dadosPlanta);
      } else {
        await criarPlanta({
          ...dadosPlanta,
          foto,
          localizacao: { latitude: -8.1194, longitude: -34.9041 },
        });
      }

      Alert.alert(
        'Sucesso',
        plantaEdicao ? 'Cadastro da planta atualizado!' : 'Planta cadastrada!'
      );
      navigation.goBack();
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.conteudo}>
        <View style={styles.card}>
          <Text style={styles.label}>Nome da Planta *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Jiboia, Espada-de-São-Jorge, Costela-de-Adão..."
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Cômodo da casa</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sala, Quarto, Varanda, Cozinha..."
            value={comodo}
            onChangeText={setComodo}
          />

          <Text style={styles.label}>
            {plantaEdicao
              ? 'Regar a cada quantos dias? *'
              : 'Regar a cada quantos dias? (opcional)'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              plantaEdicao
                ? 'Informe os dias recomendados no Guia IA'
                : 'Deixe vazio para a IA definir ou digite (ex: 3)'
            }
            keyboardType="numeric"
            value={intervaloRegaDias}
            onChangeText={setIntervaloRegaDias}
          />

          {plantaEdicao?.temFoto && !foto ? (
            <Text style={{ color: '#555', marginBottom: 8 }}>
              A foto atual será mantida. Você pode tirar outra para substituí-la.
            </Text>
          ) : null}

          <TouchableOpacity style={styles.botaoVerde} onPress={tirarFoto}>
            <Text style={styles.textoBotao}>
              {plantaEdicao ? '📷 Trocar Foto da Planta' : '📷 Tirar Foto da Planta'}
            </Text>
          </TouchableOpacity>

          {foto && (
            <Image source={{ uri: foto }} style={[styles.imagemCard, { marginTop: 12 }]} />
          )}

          <TouchableOpacity
            style={[styles.botaoVerde, { backgroundColor: '#1B5E20', marginTop: 20 }]}
            onPress={salvarPlanta}
          >
            <Text style={styles.textoBotao}>
              {plantaEdicao ? '💾 Salvar Alterações' : '💾 Salvar Planta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
