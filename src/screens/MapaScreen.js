import { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/styles';
import { listarPlantas } from '../services/api';

export default function MapaScreen() {
  const [plantas, setPlantas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarPlantas();
    }, [])
  );

  async function carregarPlantas() {
    try {
      const lista = await listarPlantas();
      // Filtra apenas as plantas que têm latitude e longitude salvas
      const comLocal = lista.filter((p) => p.localizacao && p.localizacao.latitude);
      setPlantas(comLocal);
    } catch (erro) {
      console.log('Ainda sem conexão com o backend');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Mapa das Plantas 🗺️</Text>
        <Text style={styles.headerSubtitulo}>Veja onde suas plantas foram registradas</Text>
      </View>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -8.1194,   // Região de Recife / Boa Viagem
          longitude: -34.9041,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {plantas.map((planta) => (
          <Marker
            key={planta._id}
            coordinate={{
              latitude: planta.localizacao.latitude,
              longitude: planta.localizacao.longitude,
            }}
            title={planta.nome}
            description={`Cômodo: ${planta.comodo || 'Casa'}`}
          />
        ))}
      </MapView>
    </View>
  );
}
