# Paotheon Chat 🔱

Paotheon Chat é uma interface de chat moderna e de alta performance construída com **Next.js 15**, inspirada na estética clássica e premium do tema "Pantheon". O projeto oferece uma experiência de conversação fluida com suporte a streaming de respostas e renderização de Markdown.

## ✨ Funcionalidades

- **Interface Premium**: Design elegante com estética Dark Mode, detalhes em dourado e tipografia refinada.
- **Streaming em Tempo Real**: Respostas geradas processadas via Server-Sent Events (SSE) para uma experiência instantânea.
- **Markdown Completo**: Suporte para blocos de código com realce de sintaxe, tabelas e formatação GFM.
- **Totalmente Responsivo**: Otimizado para dispositivos móveis e desktops.
- **Integração Flexível**: Backend preparado para conectar com APIs compatíveis com OpenAI.

## 🚀 Tecnologias Utilizadas

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Runtime**: [Vercel Edge Runtime](https://vercel.com/docs/functions/edge-functions/edge-runtime) (Otimizado para Streaming)
- **Linguagem**: JavaScript
- **Estilização**: CSS Modules / Vanilla CSS
- **Markdown**: `react-markdown`, `remark-gfm`
- **Highlight**: `react-syntax-highlighter`

## 🌍 Deploy na Vercel

Este projeto está pronto para ser implantado na **Vercel**.

1. Conecte seu repositório GitHub à Vercel.
2. No painel do projeto, adicione as seguintes **Environment Variables**:
   - `DO_API_URL`: O endpoint da sua API (ex: `https://api.deepinfra.com/v1`).
   - `DO_API_KEY`: Sua chave de API secreta.
   - `DO_MODEL`: O identificador do modelo (ex: `meta-llama/Llama-3.3-70B-Instruct`).
3. Clique em **Deploy**.

> **Nota**: A API de chat utiliza o **Edge Runtime** para garantir que o streaming de respostas não sofra timeout e tenha a menor latência possível.

## 🛠️ Configuração Inicial

### Pré-requisitos

Certifique-se de ter o **Node.js 18+** instalado.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/paotheonn/paotheon_chat.git
   cd paotheon_chat
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves:
   ```env
   DO_API_URL=seu_endpoint_da_api
   DO_API_KEY=sua_chave_de_api
   DO_MODEL=nome_do_modelo
   ```

### Desenvolvimento

Para rodar o servidor localmente:
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Estrutura do Projeto

- `src/app/api/chat`: Endpoint de integração com a API de LLM.
- `src/components`: Componentes modulares da interface.
- `src/app/page.js`: Página principal da aplicação.
- `public/`: Assets como logos e ícones personalizados (Spear, Logo, Favicon).

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---
Desenvolvido por [Paotheon](https://github.com/paotheonn).
