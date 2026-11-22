# CuidaPlanta

Aplicativo mobile para cadastrar e acompanhar plantas, registrar regas, visualizar plantas no mapa e consultar um guia de cuidados gerado por IA.

## Tecnologias

- Expo SDK 58
- React Native
- React Navigation
- Expo Image Picker
- Backend separado em Node.js/Express
- Google Gemini para gerar os guias de cuidados

## Executar o aplicativo

Instale as dependências e inicie o Expo:

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go. Também é possível usar `npm run android`, `npm run ios` ou `npm run web`.

## Backend

O backend não está incluído neste repositório. Inicie o projeto de backend separadamente, na pasta `cuidaplanta-app-back`:

```bash
npm install
node server.js
```

Configure as variáveis no arquivo `.env` do backend:

```env
MONGO_URI=<url-de-conexao-do-mongodb>
GEMINI_API_KEY=<sua-chave-do-gemini>
PORT=3000
```

`PORT` é opcional; o backend usa `3000` por padrão. Mantenha credenciais apenas no `.env` do backend e não as inclua no aplicativo ou no controle de versão.

## Conexão pelo Expo Go

Por padrão, o app usa o host da sessão Expo como host do backend e conecta à porta `3000`, sob o prefixo `/api`. Para isso, o celular e o computador que executa o backend devem estar na mesma rede Wi-Fi, e o firewall deve permitir conexões na porta `3000`.

Se o backend estiver em outro computador, ou se o Expo estiver sendo executado com `--tunnel`, crie `.env.local` na raiz deste projeto e informe o endereço IPv4 acessível pelo celular:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api
```

Troque `192.168.1.10` pelo endereço IP correto do computador onde o backend está rodando. Não use `localhost` ou `127.0.0.1` no celular: esses endereços apontam para o próprio aparelho. Reinicie o Expo e recarregue o app após alterar `.env.local`.

## Funcionalidades

- Cadastro de plantas com nome, cômodo, intervalo de rega e foto.
- Listagem, exclusão e registro de rega das plantas.
- Mapa das plantas cadastradas.
- Guia de luz, rega e adubação gerado por IA.

## Endpoints utilizados

| Método | Endpoint | Ação |
| --- | --- | --- |
| `GET` | `/api/plantas` | Listar plantas |
| `POST` | `/api/plantas` | Cadastrar planta |
| `PUT` | `/api/plantas/:id/regar` | Registrar rega |
| `DELETE` | `/api/plantas/:id` | Excluir planta |
| `POST` | `/api/ia/dicas/:id` | Gerar guia de cuidados |
