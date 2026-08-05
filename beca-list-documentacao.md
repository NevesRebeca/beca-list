# 📋 beca-list — Documentação do Projeto

## 1. Visão geral

O **beca-list** é uma aplicação **fullstack de lista de tarefas (to-do list)**. O usuário poderá criar, visualizar, editar e excluir tarefas, além de marcá-las como concluídas.

O objetivo deste documento é orientar a construção do projeto do zero, servindo como guia de referência técnica e funcional.

---

## 2. Estrutura de pastas raiz

```
beca-list/
├── frontend/
└── backend/
```

- **frontend/**: aplicação web (HTML, CSS, JS)
- **backend/**: API REST (Node.js + Express + Sequelize)

O frontend consome a API do backend, que por sua vez se conecta ao banco de dados MySQL (via XAMPP).

```
[ Frontend (HTML/CSS/JS) ]  --fetch()-->  [ Backend (Express API) ]  --Sequelize-->  [ MySQL (XAMPP) ]
```

---

## 3. Requisitos funcionais

O sistema deve permitir o **CRUD completo** de tarefas:

| Ação     | Descrição                                                                     |
| -------- | ----------------------------------------------------------------------------- |
| Criar    | Cadastrar uma nova tarefa                                                     |
| Listar   | Ver todas as tarefas, com paginação, busca por título e filtros por categoria |
| Editar   | Atualizar dados de uma tarefa existente                                       |
| Excluir  | Remover uma tarefa                                                            |
| Concluir | Marcar/desmarcar tarefa como concluída (checkbox)                             |

### Campos de uma tarefa

| Campo                     | Tipo sugerido                   | Obrigatório | Observações                                     |
| ------------------------- | ------------------------------- | ----------- | ----------------------------------------------- |
| `id`                      | INTEGER (PK, auto increment)    | Automático  | Gerado pelo Sequelize                           |
| `title`                   | STRING                          | Sim         | Título da tarefa                                |
| `description`             | TEXT                            | Não         | Descrição detalhada                             |
| `priority`                | ENUM (`baixa`, `media`, `alta`) | Sim         | Padrão `media`                                  |
| `due_date`                | DATE                            | Não         | Data em que a tarefa deve ser executada         |
| `completed`               | BOOLEAN                         | Sim         | Padrão `false`                                  |
| `createdAt` / `updatedAt` | DATE                            | Automático  | Gerenciados pelo Sequelize (`timestamps: true`) |

> 💡 A ordenação padrão da listagem deve ser pela mais recente primeiro (`createdAt DESC`).

> 💡 Este projeto não requer autenticação/login — é apenas uma observação de escopo, não um item de entrega.

---

## 4. Convenções de código

- **Variáveis, funções, nomes de arquivos e nomes de tabelas/colunas devem sempre ser escritos em inglês**, mesmo que os comentários e esta documentação estejam em português. Isso é padrão de mercado e facilita caso o projeto seja usado por outras pessoas ou publicado no GitHub.

Exemplos:

| Em vez de...           | Use...                                   |
| ---------------------- | ---------------------------------------- |
| `listaDeTarefas`       | `taskList`                               |
| `buscarTarefas()`      | `fetchTasks()`                           |
| `estaCarregando`       | `isLoading`                              |
| `aoEnviarFormulario()` | `handleSubmit()`                         |
| `dataDeExecucao`       | `dueDate` / `due_date` (coluna no banco) |

Convenção sugerida de nomenclatura:

- **camelCase** para variáveis e funções JavaScript (`taskList`, `fetchTasks`)
- **PascalCase** para models/classes (`Task`)
- **snake_case** para colunas do banco (`due_date`, `created_at`), se preferir seguir a convenção comum do SQL — ou `camelCase`, se preferir deixar o Sequelize converter automaticamente. O importante é manter consistência ao longo do projeto.

---

## 5. Frontend

### Tecnologias

- **HTML, CSS e JavaScript puro** (sem frameworks como React/Vue)
- **Tailwind CSS via CDN** para estilização
- Abordagem **mobile first**: construa o layout pensando em telas pequenas primeiro e depois use os prefixos responsivos do Tailwind (`sm:`, `md:`, `lg:`) para telas maiores.

### Tailwind via CDN

Adicione no `<head>` do HTML (script oficial do Play CDN):

```html
<script src="https://cdn.tailwindcss.com"></script>
```

> ⚠️ O CDN do Tailwind é recomendado apenas para desenvolvimento/estudo, não para produção. Como é um projeto de aprendizado, está perfeito para o momento.

Use ao máximo os **tokens padrão do Tailwind** (espaçamentos, tamanhos de fonte, breakpoints). A **paleta de cores** é a exceção: o projeto usa um tema escuro com cores próprias (seção 6), registradas como tokens customizados via `tailwind.config` e usadas como classes utilitárias normais (`bg-surface`, `text-text`, `bg-accent`, etc.).

### Organização sugerida de arquivos

```
frontend/
├── index.html
├── css/
│   └── styles.css          # estilos customizados que fogem do Tailwind
├── js/
│   ├── api.js               # funções que fazem as chamadas fetch() ao backend
│   ├── ui.js                 # funções que manipulam o DOM (renderizar tarefas, loading, modal, etc.)
│   ├── debounce.js           # função utilitária de debounce
│   └── main.js                # ponto de entrada, conecta tudo (eventos, inicialização)
└── assets/
    └── icons/ ou imagens, se precisar
```

### Loading nas chamadas ao backend

Toda chamada `fetch()` ao backend deve exibir um indicador de carregamento (ex: um spinner ou texto "Carregando..."), e escondê-lo quando a resposta chegar. Um padrão simples:

```js
async function fetchTasks() {
  showLoading();
  try {
    const response = await fetch("http://localhost:3000/tasks");
    const data = await response.json();
    renderTasks(data);
  } catch (error) {
    showError("Erro ao carregar tarefas");
  } finally {
    hideLoading();
  }
}
```

### Busca com debounce

Ao digitar na barra de pesquisa, a busca deve ocorrer por título, mas **sem disparar uma requisição a cada tecla digitada**. Use a técnica de **debounce**: espera um pequeno intervalo (ex: 300-500ms) após o usuário parar de digitar antes de buscar.

```js
function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const searchInput = document.getElementById("search");
searchInput.addEventListener(
  "input",
  debounce((e) => {
    fetchTasks({ search: e.target.value });
  }, 400),
);
```

---

## 6. Design e UI

### Paleta de cores (tema escuro)

O sistema é monocromático: um acento (vermelho/laranja) sobre uma rampa neutra escura.

| Token                   | Hex       | Uso                             |
| ----------------------- | --------- | ------------------------------- |
| `--color-bg`            | `#201E1D` | Fundo geral da aplicação        |
| `--color-surface`       | `#2D2B2B` | Fundo de cards/linhas de tarefa |
| `--color-text`          | `#F3F2F2` | Texto principal                 |
| `--color-divider`       | `#605D5D` | Linhas divisórias               |
| `--color-accent` (ação) | `#EC3013` | Cor de ação primária            |
| `--color-accent-500`    | `#FF563C` | Prioridade alta                 |
| `--color-accent-300`    | `#FFC4B8` | Prioridade média                |
| `--color-neutral-400`   | `#BAB6B6` | Prioridade baixa                |

**Regra de uso:** o vermelho aparece em só três lugares — ação primária (Nova tarefa, Salvar, Excluir confirmado), sinal de atraso e prioridade alta. Todo o resto é "tinta sobre fundo" (texto/ícones neutros).

Registro dessas cores no Tailwind via CDN:

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          bg: "#201E1D",
          surface: "#2D2B2B",
          text: "#F3F2F2",
          divider: "#605D5D",
          accent: {
            DEFAULT: "#EC3013",
            500: "#FF563C", // prioridade alta
            300: "#FFC4B8", // prioridade média
          },
          neutral: {
            400: "#BAB6B6", // prioridade baixa
          },
        },
      },
    },
  };
</script>
```

### No Tailwind v4

<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">
  @theme {
    --color-bg: #201E1D;
    --color-surface: #2D2B2B;
    --color-text: #F3F2F2;
    --color-divider: #605D5D;

    --color-accent: #EC3013;
    --color-accent-500: #FF563C; /* prioridade alta */
    --color-accent-300: #FFC4B8; /* prioridade média */

    --color-neutral-400: #BAB6B6; /* prioridade baixa */
  }
</style>

### Componentes da tela de listagem

- Cabeçalho com contador de tarefas em aberto (ex: "6 em aberto") e, no mobile, um bloco extra "para hoje"
- Campo de busca (usa o debounce já especificado na seção 5)
- Botão "Nova tarefa +"
- Chips de filtro: **Todas / Hoje / Prioridade alta / Concluídas**, cada um com uma contagem ao lado, mais um indicador separado de "atrasadas"
- Cada tarefa exibe: checkbox, título, descrição, badge de data (Hoje/Amanhã/dd MMM), badge de prioridade com ícone de seta (↑ Alta, → Média, ↓ Baixa)
- No **desktop**, os botões "Editar" e "Excluir" aparecem diretamente na linha da tarefa
- No **mobile**, toque no card para abrir o modal de edição, sem botões inline
- Tarefa concluída: checkbox marcado (vermelho, com ícone de check), título com `line-through` e texto esmaecido (`text-divider` ou opacidade reduzida)

> Use sempre o modal de criar/editar (mobile e desktop) para as ações da tarefa, sem criar uma tela de detalhe separada — isso mantém a implementação mais simples, já que o frontend é HTML/CSS/JS puro sem um framework de rotas.

### Modal de criar/editar tarefa (componente reaproveitado)

- Um único modal serve tanto para criar quanto para editar — muda apenas o título ("Nova tarefa" / "Editar tarefa"), o texto do botão principal ("Criar tarefa" / "Salvar alterações") e se os campos vêm vazios ou preenchidos.
- Campos: **Título** (obrigatório, placeholder "O que precisa ser feito?"), **Descrição** (textarea, opcional), **Executar em** (`input type="date"`), **Prioridade** (3 botões em grupo — Alta ↑ / Média → / Baixa ↓ —, com Média marcada como padrão ao criar).
- No mobile, o modal sobe como bottom sheet (do rodapé para cima); no desktop, aparece centralizado com um fundo escurecido (overlay). Ambos podem ser feitos com Tailwind puro (`fixed`, `inset-0`, `bg-black/50` para o overlay).

Organize essa lógica em uma única função, `openTaskModal(mode, taskData)`, onde `mode` é `"create"` ou `"edit"`, para não duplicar HTML/lógica entre os dois fluxos.

### Regra de tarefa atrasada

Uma tarefa é considerada atrasada quando a `due_date` é anterior à data atual e ela ainda não foi concluída:

```js
function isOverdue(task) {
  return (
    !task.completed && new Date(task.due_date) < new Date().setHours(0, 0, 0, 0)
  );
}
```

Pode ser calculada no frontend (mais simples, suficiente para este projeto) ou devolvida já pronta pelo backend (mais correto, evita depender do fuso horário do navegador).

### Filtros e contadores

A listagem tem filtros por categoria — **Todas / Hoje / Prioridade alta / Concluídas** — cada um exibindo uma contagem, além de um indicador de tarefas atrasadas.

- Os filtros (`status=completed`, `priority=alta`, `due=today`, etc.) devem ser aceitos como parâmetros de query na rota `GET /tasks`, complementando `search`, `page` e `limit`.
- Como a listagem é paginada, as contagens de cada categoria devem ser calculadas no backend com agregação (`COUNT()`), não a partir dos itens da página atual exibida na tela. Inclua um objeto `counts` na resposta do `GET /tasks` (ou crie um endpoint dedicado, ex: `GET /tasks/counts`), com o total por categoria.

### Ícones de prioridade

↑ para Alta, → para Média, ↓ para Baixa, consistentes em todas as telas. Dá para usar os próprios caracteres Unicode (↑ → ↓) no HTML, sem precisar de nenhuma biblioteca de ícones.

---

## 7. Backend

### Tecnologias

- **Node.js** (instale a versão LTS mais recente disponível — no momento em que este documento foi escrito, a linha ativa é a Node 24.x LTS, mas confira sempre a versão LTS mais recente no site oficial)
- **Express** para criação da API REST
- **Sequelize** como ORM, conectado ao **MySQL**
- **CORS**: como o frontend e o backend rodam em origens/portas diferentes, será necessário o middleware `cors` no Express para permitir as requisições do frontend
- **dotenv**: recomendado para guardar as credenciais do banco (usuário, senha, host, nome do banco) fora do código, em um arquivo `.env`
- **nodemon** (dependência de desenvolvimento): reinicia o servidor automaticamente a cada alteração no código, facilitando o desenvolvimento

### Organização sugerida de arquivos

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # configuração da conexão Sequelize com o MySQL
│   ├── models/
│   │   └── Task.js            # model da tabela de tarefas
│   ├── controllers/
│   │   └── taskController.js  # lógica de cada rota (criar, listar, editar, excluir)
│   ├── routes/
│   │   └── taskRoutes.js      # define os endpoints e liga aos controllers
│   └── app.js                  # configuração do Express (middlewares, rotas)
├── .env                          # variáveis de ambiente (não subir para o Git)
├── .gitignore
├── package.json
└── server.js                     # ponto de entrada, sobe o servidor
```

### Endpoints sugeridos (API REST)

| Método   | Rota                                  | Descrição                                                             |
| -------- | ------------------------------------- | --------------------------------------------------------------------- |
| `GET`    | `/tasks?page=1&limit=10&search=texto` | Lista tarefas com paginação, busca por título e filtros por categoria |
| `GET`    | `/tasks/:id`                          | Busca uma tarefa específica                                           |
| `POST`   | `/tasks`                              | Cria uma nova tarefa                                                  |
| `PUT`    | `/tasks/:id`                          | Atualiza uma tarefa (inclusive marcar como concluída)                 |
| `DELETE` | `/tasks/:id`                          | Remove uma tarefa                                                     |

### Paginação

O backend deve aceitar os parâmetros `page` e `limit` via query string e tratá-los internamente usando `limit` e `offset` do Sequelize:

```js
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const offset = (page - 1) * limit;

const tasks = await Task.findAndCountAll({
  limit,
  offset,
  order: [["createdAt", "DESC"]], // mais recente primeiro
  where: search ? { title: { [Op.like]: `%${search}%` } } : {},
});
```

---

## 8. Banco de dados

- Use o **XAMPP** para rodar o **MySQL** localmente. No banco, o desenvolvedor faz apenas o **setup inicial**: iniciar os serviços de Apache/MySQL no painel do XAMPP e criar um banco de dados vazio (ex: `beca_list`) pelo phpMyAdmin ou via terminal.
- **As tabelas não são criadas manualmente no phpMyAdmin.** Quem cria a estrutura das tabelas é o **Sequelize**, a partir do model (`Task.js`) definido no backend, usando `sequelize.sync()`.
- Configure a conexão do Sequelize com esse banco em `src/config/database.js`, usando as credenciais do `.env`.

---

## 9. Fluxo de integração resumido

1. O usuário interage com a interface (HTML/CSS/JS + Tailwind).
2. O JavaScript do frontend faz uma requisição `fetch()` para a API (`http://localhost:PORTA/tasks`).
3. O Express recebe a requisição, chama o controller correspondente.
4. O controller usa o Sequelize para consultar/alterar o MySQL.
5. O backend responde em JSON.
6. O frontend recebe a resposta e atualiza a tela (escondendo o loading).

---

## 10. Ordem sugerida de desenvolvimento

Existem três abordagens comuns para começar um projeto fullstack. Vale entender os prós e contras de cada uma antes de escolher:

### Opção A — Frontend completo primeiro

Constrói toda a tela, depois liga com o backend.

- Feedback visual imediato, motivador no começo.
- Precisa simular dados falsos (mock) que podem não bater com o formato real da API depois. Gera retrabalho na hora de integrar. O iniciante aprende a "decorar" a tela sem entender de onde vêm os dados.

### Opção B — Backend completo primeiro

Constrói toda a API e o banco, depois faz a tela.

- Define bem o "contrato" da API (rotas, formato dos dados) antes de tudo. Força entender bem Sequelize/banco.
- Fica muito tempo sem ver nada visualmente rodando — desmotivador para quem está começando. Testar só via Postman/Insomnia exige aprender outra ferramenta antes de ver qualquer resultado "de verdade".

### Opção C — Por feature (fatia vertical / "vertical slice")

Para cada funcionalidade, implementa o mínimo necessário em banco → backend → frontend, até funcionar de ponta a ponta, e só então parte para a próxima funcionalidade.

- Fecha o ciclo completo rapidamente — o iniciante entende toda a "viagem" do dado, do banco até a tela, logo na primeira feature. Feedback rápido e motivador. Erros de configuração (CORS, conexão com banco, porta errada) aparecem cedo e isolados, mais fáceis de debugar.
- Um pouco mais de troca de contexto entre frontend e backend a cada funcionalidade.

### Recomendação para um iniciante em fullstack: Opção C

Para quem está aprendendo a integrar as duas pontas pela primeira vez, a abordagem por feature (fatia vertical) costuma ensinar melhor porque força entender a conexão completa desde cedo, em vez de acumular duas metades separadas que só se encontram no final — momento em que costumam aparecer os bugs mais difíceis de rastrear (é o momento clássico em que iniciantes travam por dias tentando descobrir se o erro é no front, no back ou na configuração).

**Sugestão de passo 0 — "esqueleto que anda":** antes de implementar qualquer feature real, monte a versão mínima de cada ponta só para provar que a cadeia inteira funciona: uma rota de teste no backend (ex: `GET /ping` retornando `{ status: "ok" }`), chamada pelo frontend e exibida na tela. Isso garante que Node/Express, CORS, conexão com o MySQL e o fetch do frontend já estão funcionando antes de começar a lógica de tarefas de verdade.

**Ordem sugerida de features (da mais simples para a mais complexa):**

1. **Setup inicial**: estrutura de pastas, servidor Express rodando, conexão com o MySQL, HTML base com Tailwind (incluindo as cores do tema, seção 6) — validado pelo "esqueleto que anda".
2. **Listagem de tarefas** (`GET /tasks`): só leitura, sem formulário — já usa o loading. Boa primeira feature real por ser a mais simples.
3. **Criar tarefa** (`POST /tasks`): modal de criação + inserção no banco.
4. **Concluir/desmarcar tarefa**: update pequeno e isolado, reforça o ciclo de escrita sem a complexidade de um formulário inteiro.
5. **Editar tarefa** (`PUT /tasks/:id`): reaproveita o mesmo modal da criação.
6. **Excluir tarefa** (`DELETE /tasks/:id`).
7. **Busca por título com debounce**: incrementa a listagem já existente.
8. **Paginação**: incrementa a listagem já existente.
9. **Filtros, contadores e indicador de atraso**: implemente por último, depois que o CRUD básico e a listagem estiverem sólidos.

Para cada feature da lista acima, o fluxo dentro dela é sempre: **1)** ajustar o model se precisar de campo novo → **2)** criar rota + controller no backend → **3)** testar a rota isoladamente (Postman, Insomnia ou Thunder Client) → **4)** integrar no frontend (fetch + renderização) → **5)** testar o fluxo completo na tela antes de seguir para a próxima.

---

## 11. Conceitos importantes para estudar durante o projeto

- **Fetch API e async/await**: como fazer requisições HTTP no JavaScript puro.
- **REST API**: convenções de métodos HTTP (GET, POST, PUT, DELETE) e status codes.
- **CORS**: por que é necessário e como configurar no Express.
- **ORM (Sequelize)**: como mapear uma tabela do banco para um "model" em JavaScript.
- **Debounce**: técnica para atrasar a execução de uma função até que o usuário pare de disparar o evento (muito usada em campos de busca).
- **Mobile first**: construir o layout pensando primeiro em telas pequenas.
- **Paginação com LIMIT/OFFSET**: como dividir grandes listas de dados em páginas.
- **Vertical slice / Walking skeleton**: construir uma funcionalidade completa de ponta a ponta antes de partir para a próxima, em vez de terminar uma camada inteira (front ou back) primeiro.
- **Manipulação de datas em JS**: comparar `due_date` com a data atual para calcular se uma tarefa está atrasada.
- **Agregação no banco (`COUNT`)**: como calcular contadores (ex: quantas tarefas concluídas) sem trazer todos os registros para o frontend.
- **Componente reaproveitável**: usar o mesmo modal/formulário tanto para criar quanto para editar, variando só os dados de entrada.

---

## 12. Uso de IA como apoio (opencode)

A ferramenta **opencode** pode ser usada como apoio pontual durante o desenvolvimento (tirar dúvidas, revisar trechos de código, sugerir correções). No entanto, o foco principal deve ser:

1. Pesquisar você mesmo a documentação oficial de cada ferramenta (links abaixo).
2. Tentar resolver os problemas antes de perguntar à IA.
3. Usar a IA para validar entendimento, não para gerar o projeto inteiro por você — o objetivo é aprender.

---

## 13. Checklist de entrega

### Obrigatório

- [ ] Setup mínimo e funcional dos dois projetos (`frontend` e `backend` rodando, comunicando entre si)
- [ ] CRUD completo de tarefas funcionando (criar, listar, editar, excluir)
- [ ] Checkbox de concluir/desmarcar tarefa
- [ ] Layout responsivo, mobile first, com Tailwind (CDN) e paleta de cores do tema escuro
- [ ] Loading visível em toda chamada ao backend
- [ ] Modal único reaproveitado para criar/editar tarefa
- [ ] Conexão do backend com o MySQL (XAMPP) via Sequelize funcionando, com as tabelas criadas pelo próprio Sequelize
- [ ] Variáveis, funções e nomes de arquivos em inglês

### Adicional

- [ ] Busca por título com debounce funcionando
- [ ] Paginação funcionando (frontend envia parâmetros, backend trata)
- [ ] Tarefas ordenadas da mais recente primeiro
- [ ] Filtros por categoria (Todas/Hoje/Prioridade alta/Concluídas) com contadores
- [ ] Badge de tarefa atrasada implementado

---

## 14. Documentação oficial das ferramentas

| Ferramenta                                      | Link oficial                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| Node.js                                         | https://nodejs.org/en/docs                                                            |
| Express                                         | https://expressjs.com/                                                                |
| Sequelize                                       | https://sequelize.org/docs/v6/                                                        |
| MySQL                                           | https://dev.mysql.com/doc/                                                            |
| XAMPP                                           | https://www.apachefriends.org/                                                        |
| Tailwind CSS (Play CDN)                         | https://tailwindcss.com/docs/installation/play-cdn                                    |
| Tailwind CSS — Responsive Design (mobile first) | https://tailwindcss.com/docs/responsive-design                                        |
| Tailwind CSS — Customizing colors (tema escuro) | https://tailwindcss.com/docs/colors                                                   |
| MDN — HTML                                      | https://developer.mozilla.org/pt-BR/docs/Web/HTML                                     |
| MDN — CSS                                       | https://developer.mozilla.org/pt-BR/docs/Web/CSS                                      |
| MDN — JavaScript                                | https://developer.mozilla.org/pt-BR/docs/Web/JavaScript                               |
| MDN — Fetch API                                 | https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API                            |
| MDN — setTimeout (base do debounce)             | https://developer.mozilla.org/pt-BR/docs/Web/API/setTimeout                           |
| MDN — Date (cálculo de tarefa atrasada)         | https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date |

---

_Documento criado para orientar o desenvolvimento do projeto beca-list por um desenvolvedor iniciante em ambiente fullstack._
