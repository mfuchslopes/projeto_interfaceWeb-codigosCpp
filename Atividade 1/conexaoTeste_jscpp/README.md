# Atividade de Teste

Projeto com front-end em HTML/CSS/JavaScript, back-end em Node.js com Express e um backend nativo em C++.

## Pré-requisitos

- Node.js instalado
- npm disponível
- Compilador C++ instalado:
  - macOS: g++ (normalmente vem com Xcode Command Line Tools)
  - Linux: g++
  - Windows: g++ do MinGW ou equivalente

## Como rodar do zero

### 1. Instalar as dependências do Node

Na pasta do projeto, execute:

bash
npm install


### 2. Compilar o backend em C++

#### macOS / Linux

bash
g++ backend.cpp -o backend


#### Windows

bash
g++ backend.cpp -o backend.exe


> Observação: o arquivo server.js também tenta compilar o backend automaticamente ao iniciar, mas este passo manual é útil para garantir que tudo está pronto.

### 3. Iniciar o servidor

bash
npm start


O servidor vai subir em:

bash
http://localhost:3000


## Como usar

- Abra http://localhost:3000 no navegador
- Clique nas células ou no botão de escolha aleatória
- O front-end envia os dados para a API em /api
- O server.js chama o binário C++ e devolve o resultado

## Estrutura principal

- index.html — interface do projeto
- style.css — estilos
- script.js — lógica do front-end
- server.js — API em Express e integração com o C++
- backend.cpp — lógica em C++

## Se der erro

- Verifique se o binário foi gerado:
  - macOS/Linux: backend
  - Windows: backend.exe
- Verifique se a porta 3000 está livre
- Se estiver no macOS e o g++ não existir, instale as Command Line Tools:

bash
xcode-select --install


## Teste rápido da API

Depois de iniciar o servidor, você pode testar a API com:

bash
curl -X POST http://localhost:3000/api \
  -H 'Content-Type: application/json' \
  -d '{"row":1,"col":2}'