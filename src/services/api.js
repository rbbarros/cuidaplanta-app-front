import Constants from 'expo-constants';

function obterUrlApi() {
  const urlConfigurada = process.env.EXPO_PUBLIC_API_URL;
  if (urlConfigurada) {
    return urlConfigurada.replace(/\/+$/, '');
  }

  const hostExpo = Constants.expoConfig?.hostUri;
  if (!hostExpo) {
    throw new Error(
      'Backend não configurado. Defina EXPO_PUBLIC_API_URL com a URL do servidor.'
    );
  }

  const host = hostExpo.replace(/:\d+$/, '');
  return `http://${host}:3000/api`;
}

// Função auxiliar: faz a requisição e já devolve o JSON
async function requisicao(caminho, opcoes) {
  const apiUrl = obterUrlApi();
  let resposta;

  try {
    resposta = await fetch(apiUrl + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch (erro) {
    throw new Error(
      `Não foi possível conectar ao backend em ${apiUrl}. Confirme que o servidor está ativo e acessível pelo celular. (${erro.message})`
    );
  }

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao falar com o servidor.');
  }
  return dados;
}

export function listarPlantas() {
  return requisicao('/plantas');
}

export function buscarPlanta(id) {
  return requisicao('/plantas/' + id);
}

export function criarPlanta(planta) {
  return requisicao('/plantas', {
    method: 'POST',
    body: JSON.stringify(planta),
  });
}

export function atualizarPlanta(id, planta) {
  return requisicao('/plantas/' + id, {
    method: 'PUT',
    body: JSON.stringify(planta),
  });
}

export function marcarRega(id) {
  return requisicao('/plantas/' + id + '/regar', {
    method: 'PUT',
  });
}

export function removerPlanta(id) {
  return requisicao('/plantas/' + id, { method: 'DELETE' });
}

export function gerarDicasIA(id) {
  return requisicao('/ia/dicas/' + id, { method: 'POST' });
}

export const gerarGuiaIA = gerarDicasIA;
