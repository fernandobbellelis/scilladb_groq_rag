# Groq Chat App

Uma aplicação de chat elegante que se integra com uma API Groq.

## Requisitos

- Node.js 18.x ou superior
- npm, yarn ou pnpm

## Configuração

1. Clone o repositório ou extraia o arquivo zip

2. Instale as dependências:

\`\`\`bash
npm install
# ou
yarn
# ou
pnpm install
\`\`\`

3. Configure a variável de ambiente:

Crie um arquivo `.env.local` na raiz do projeto e adicione:

\`\`\`
BACKEND_URL=http://localhost:8000
\`\`\`

Substitua a URL pelo endereço do seu backend Sanic.

## Executando o projeto

\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Estrutura do Projeto

- `app/` - Componentes e páginas da aplicação Next.js
- `components/` - Componentes reutilizáveis
- `lib/` - Funções utilitárias e API
- `middleware.ts` - Configuração para redirecionar requisições para o backend

## Funcionalidades

- Envio de mensagens para o assistente Groq
- Visualização do histórico de conversas
- Reset da conversa
- Interface responsiva e moderna
- Gerenciamento de estado com React Query

## Tecnologias Utilizadas

- Next.js 14
- React 18
- TanStack Query (React Query)
- Tailwind CSS
- shadcn/ui
- TypeScript
