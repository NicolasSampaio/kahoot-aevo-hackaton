# Kahoot Aevo

Um aplicativo de quiz multiplayer estilo Kahoot, construído com Next.js, React e TypeScript. Perfeito para jogar com amigos em tempo real!

![Demo](https://img.shields.io/badge/Demo-Live-green)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwindcss)

## Funcionalidades

- **Salas Multiplayer**: Crie salas com código único de 6 dígitos
- **Lobby Interativo**: Veja jogadores entrarem em tempo real com avatares animados
- **Fluxo de Jogo Completo**: Countdown → Perguntas → Revelação → Leaderboard
- **Animações Fluidas**: Transições suaves com Framer Motion
- **Sistema de Pontuação**: Pontos baseados na velocidade de resposta
- **Ranking Final**: Pódio animado com confetes e estatísticas detalhadas
- **Tempo Real**: Comunicação em tempo real via Server-Sent Events

## Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React 18+, TypeScript
- **Estilização**: Tailwind CSS, shadcn/ui
- **Animações**: Framer Motion
- **Estado Global**: Zustand
- **Comunicação Real-time**: Server-Sent Events (SSE)
- **Ícones**: Lucide React

## Instalação

```bash
# Clone o repositório
git clone https://github.com/NicolasSampaio/kahoot-aevo-hackaton.git
cd kahoot-aevo-hackaton

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## Como Usar

### Criar uma Sala (Host)

1. Na página inicial, clique em **"Create Room"**
2. Configure o nome da sala, número máximo de jogadores (2-50)
3. Adicione perguntas personalizadas:
   - Texto da pergunta
   - 4 opções de resposta (A/B/C/D)
   - Resposta correta
   - Tempo limite (10/15/20/30 segundos)
4. Mínimo de 3 perguntas
5. Clique em **"Create Room"** e compartilhe o código de 6 dígitos

### Entrar em uma Sala (Jogador)

1. Clique em **"Join Room"** na página inicial
2. Digite o código de 6 dígitos da sala
3. Escolha seu nome
4. Selecione um avatar (emoji)
5. Aguarde o host iniciar o jogo

### Durante o Jogo

- **Countdown**: Animação 3-2-1 antes de cada pergunta
- **Responder**: Toque nas cartas coloridas (vermelho ▲, azul ◆, verde ●, amarelo ■)
- **Revelação**: Veja a resposta correta e quantos acertaram
- **Leaderboard**: Confira a posição atual entre as perguntas
- **Resultados Finais**: Pódio animado com confetes para os top 3!

## Estrutura do Projeto

```
├── app/                    # Rotas Next.js (App Router)
│   ├── api/               # API Routes (Room CRUD, SSE)
│   ├── create-room/       # Criar nova sala
│   ├── join/              # Entrar em sala existente
│   ├── room/[code]/       # Sala dinâmica
│   │   ├── lobby/         # Lobby de espera
│   │   ├── play/          # Tela do jogo
│   │   └── results/       # Resultados finais
│   └── page.tsx           # Landing page
├── components/            # Componentes React
│   ├── game/              # Componentes do jogo
│   ├── room/              # Componentes da sala
│   ├── results/           # Componentes de resultados
│   └── ui/                # Componentes shadcn/ui
├── hooks/                 # Custom hooks
│   ├── useGameEngine.ts   # Lógica do jogo
│   ├── useRoomEvents.ts   # Conexão SSE
│   └── useTimer.ts        # Gerenciamento de timer
├── lib/
│   ├── store/             # Zustand store
│   └── utils.ts           # Utilitários
├── types/                 # TypeScript types
└── docs/                  # Documentação dos prompts
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint

## Fluxo de Estados do Jogo

```
waiting → countdown → question → answer-reveal → leaderboard
                                           ↓
                                    final-results (última pergunta)
```

## Comunicação Real-time

O app utiliza **Server-Sent Events (SSE)** para comunicação em tempo real:

- `player-joined` - Novo jogador entrou na sala
- `game-started` - Host iniciou o jogo
- `next-question` - Próxima pergunta disponível
- `answer-reveal` - Revelação das respostas
- `game-ended` - Jogo finalizado

## Diferenciais

- **Animações Performáticas**: Usando apenas `transform` e `opacity` (GPU-acelerado)
- **Design Mobile-First**: Optimizado para jogar no celular
- **Acessibilidade**: Ícones de formas para daltônicos, navegação por teclado
- **Feedback Imediato**: Animações de confirmação e erro
- **Sem Banco de Dados**: Storage em memória para MVP rápido

## Testando Multiplayer Localmente

1. Inicie o servidor: `npm run dev`
2. Abra o navegador em `http://localhost:3000`
3. Crie uma sala
4. Abra 2-3 abas anônimas (Ctrl+Shift+N no Chrome)
5. Entre na mesma sala com nomes diferentes
6. Jogue!

## Cores do Projeto

- **Laranja Principal**: `#F2722A`
- **Preto**: `#000000`
- **Branco**: `#FFFFFF`
- **Cores das Respostas**: Vermelho, Azul, Verde, Amarelo

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

MIT License - veja [LICENSE](LICENSE) para mais detalhes.

---

Feito com durante o Hackathon Aevo
