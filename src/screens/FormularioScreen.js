import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { styles } from '../styles/styles';
import { cadastrarPlanta } from '../services/api';

export default function FormularioScreen({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [comodo, setComodo] = useState('');
  const [intervaloRegaDias, setIntervaloRegaDias] = useState('');
  const [foto, setFoto] = useState(null);

  // Recebe a foto caso o usuário tenha tirado direto pela tela inicial
  useEffect(() => {
    if (route.params?.fotoInicial) {
      setFoto(route.params.fotoInicial);
    }
  }, [route.params?.fotoInicial]);

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão', 'Precisamos de acesso à câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.4,
    });

    if (!resultado.canceled) {
      setFoto(`data:image/jpeg;base64,${resultado.assets.base64}`);
    }
  }

  async function escolherGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão', 'Precisamos de acesso à galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.4,
    });

    if (!resultado.canceled) {
      setFoto(`data:image/jpeg;base64,${resultado.assets.base64}`);
    }
  }

  async function salvarPlanta() {
    if (!nome) {
      Alert.alert('Atenção', 'Digite o nome da planta!');
      return;
    }

    try {
      let localizacao = null;
      const permLoc = await Location.requestForegroundPermissionsAsync();
      if (permLoc.granted) {
        const pos = await Location.getCurrentPositionAsync({});
        localizacao = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      }

      await cadastrarPlanta({
        nome,
        comodo,
        intervaloRegaDias: Number(intervaloRegaDias) || 3,
        foto,
        localizacao,
      });

      setNome('');
      setComodo('');
      setIntervaloRegaDias('');
      setFoto(null);
      Alert.alert('Sucesso', 'Planta cadastrada!');
      navigation.navigate('Minhas Plantas');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Nova Planta 🌿</Text>
        <Text style={styles.headerSubtitulo}>Cadastre uma plantinha da sua casa</Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.card}>
          <Text style={styles.label}>Nome da Planta *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Jiboia, Espada-de-São-Jorge..."
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Cômodo da casa</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sala, Varanda, Quarto..."
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
            <Text style={styles.textoBotao}>📷 Tirar Foto com Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.botaoVerde, { backgroundColor: '#558B2F' }]} 
            onPress={escolherGaleria}
          >
            <Text style={styles.textoBotao}>🖼️ Escolher da Galeria</Text>
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
