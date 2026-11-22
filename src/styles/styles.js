import { StyleSheet } from 'react-native';

export const cores = {
  verde: '#2E7D32',
  branco: '#FFFFFF',
};export const styles = StyleSheet.create({
  // Fundo verde bem clarinho (igual ao seu print)
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  // Cabeçalho verde escuro do CuidaPlanta
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitulo: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerSubtitulo: {
    color: '#E8F5E9',
    fontSize: 14,
    marginTop: 5,
  },
  // Área de conteúdo com espaçamento
  conteudo: {
    padding: 16,
  },
  // Cartão branco arredondado
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Sombra leve no Android
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 12,
  },
  // Botão verde principal
  botaoVerde: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Botão azul para marcar rega
  botaoRegar: {
    backgroundColor: '#0288D1',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  // Campos de digitação
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  imagemCard: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
});
