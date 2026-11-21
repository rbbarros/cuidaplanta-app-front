const API_URL = 'http://192.168.1.4';

// 1. Buscar todas as plantas
export async function listarPlantas() {
  const resposta = await fetch(`${API_URL}/plantas`);
  return resposta.json();
}

// 2. Cadastrar uma nova planta
export async function cadastrarPlanta(dados) {
  const resposta = await fetch(`${API_URL}/plantas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

// 3. Marcar que regou a planta hoje
export async function marcarRega(id) {
  const resposta = await fetch(`${API_URL}/plantas/${id}/regar`, {
    method: 'PUT',
  });
  return resposta.json();
}

// 4. Excluir uma planta
export async function excluirPlanta(id) {
  await fetch(`${API_URL}/plantas/${id}`, {
    method: 'DELETE',
  });
}

// 5. Pedir dicas para a IA (Gemini)
export async function gerarGuiaIA(id) {
  const resposta = await fetch(`${API_URL}/ia/dicas/${id}`, {
    method: 'POST',
  });
  return resposta.json();
}
