import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../styles/styles';
import { criarPlanta } from '../services/api';

export default function FormularioScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [comodo, setComodo] = useState('');
  const [intervaloRegaDias, setIntervaloRegaDias] = useState('');
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
    if (!nome) {
      Alert.alert('Atenção', 'Digite o nome da planta!');
      return;
    }

    try {
      await criarPlanta({
        nome,
        comodo,
        intervaloRegaDias: Number(intervaloRegaDias) || 3,
        foto,
        localizacao: { latitude: -8.1194, longitude: -34.9041 },
      });

      Alert.alert('Sucesso', 'Planta cadastrada!');
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

          <Text style={styles.label}>Regar a cada quantos dias?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 3"
            keyboardType="numeric"
            value={intervaloRegaDias}
            onChangeText={setIntervaloRegaDias}
          />

          <TouchableOpacity style={styles.botaoVerde} onPress={tirarFoto}>
            <Text style={styles.textoBotao}>📷 Tirar Foto da Planta</Text>
          </TouchableOpacity>

          {foto && (
            <Image source={{ uri: foto }} style={[styles.imagemCard, { marginTop: 12 }]} />
          )}

          <TouchableOpacity
            style={[styles.botaoVerde, { backgroundColor: '#1B5E20', marginTop: 20 }]}
            onPress={salvarPlanta}
          >
            <Text style={styles.textoBotao}>💾 Salvar Planta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
