# ✅ Checklist — Projeto beca-list

## Fase 0 — Ambiente e "esqueleto que anda"

- [x] Confirmar Node.js instalado (`node -v`)
- [x] Abrir XAMPP Control Panel e iniciar os serviços **Apache** e **MySQL**
- [x] Criar banco de dados vazio `beca_list` no phpMyAdmin
- [x] Criar estrutura de pastas `frontend/` e `backend/`
- [x] Backend: iniciar projeto Node (`npm init`), instalar `express`, `sequelize`, `mysql2`, `cors`, `dotenv`, `nodemon`
- [x] Backend: criar `.env`, `.gitignore`, `server.js`, `src/app.js`
- [x] Backend: criar rota de teste `GET /ping` retornando `{ status: "ok" }`
- [x] Conectando opencode ao projeto;
- [x] Backend: criar `src/config/database.js` e conectar Sequelize ao MySQL (XAMPP)
- [x] Frontend: criar `index.html` base com Tailwind via CDN + cores do tema (seção 6)
- [x] Frontend: `fetch()` no `GET /ping` e mostrar resultado na tela
- [x] **Validação:** ver "ok" na tela = esqueleto funcionando ponta a ponta 🎉

## Fase 1 — Listagem de tarefas (`GET /tasks`)

- [x] Backend: criar model `Task.js` (title, description, priority, due_date, completed)
- [x] Backend: `sequelize.sync()` cria a tabela automaticamente
- [x] Backend: rota + controller `GET /tasks` (sem filtros ainda, ordenado por `createdAt DESC`)
- [x] Testar rota isolada no Postman/Insomnia/Thunder Client
- [x] Frontend: função `fetchTasks()` em `js/api.js`
- [x] Frontend: renderizar lista de tarefas na tela (com loading)
- [x] Frontend: layout mobile first da lista (cards, badges de prioridade/data)

## Fase 2 — Criar tarefa (`POST /tasks`)

- [x] Backend: rota + controller `POST /tasks`
- [x] Testar no Postman/Insomnia
- [x] Frontend: modal `openTaskModal("create")`
- [x] Frontend: enviar formulário via fetch e atualizar lista

## Fase 3 — Concluir/desmarcar tarefa

- [x] Backend: `PUT /tasks/:id` aceitando toggle de `completed`
- [x] Frontend: checkbox conectado ao endpoint
- [x] Frontend: estilo de tarefa concluída (line-through, cor esmaecida)

## Fase 4 — Editar tarefa (`PUT /tasks/:id`)

- [x] Backend: `PUT /tasks/:id` completo (todos os campos)
- [x] Frontend: reaproveitar modal em `openTaskModal("edit", taskData)`

## Fase 5 — Excluir tarefa (`DELETE /tasks/:id`)

- [x] Backend: rota + controller `DELETE /tasks/:id`
- [x] Frontend: botão excluir + confirmação + atualizar lista

## Fase 6 — Busca com debounce

- [x] Frontend: `js/debounce.js`
- [x] Backend: `GET /tasks?search=texto` (filtro por título)
- [x] Frontend: input de busca conectado com debounce (300–500ms)

## Fase 7 — Paginação

- [ ] Backend: `GET /tasks?page=&limit=` usando `limit`/`offset`
- [ ] Frontend: controles de página conectados

## Fase 8 — Filtros, contadores e atraso (por último)

- [ ] Backend: `counts` no `GET /tasks` (ou `GET /tasks/counts`) via `COUNT()`
- [ ] Backend/Frontend: `isOverdue()` (atrasada = due_date passada e não concluída)
- [ ] Frontend: chips de filtro (Todas/Hoje/Prioridade alta/Concluídas) + contadores
- [ ] Frontend: badge de atrasada

## Fase 9 — Revisão final (checklist de entrega, seção 13)

- [ ] Frontend e backend rodando e comunicando
- [ ] CRUD completo funcionando
- [ ] Checkbox concluir/desmarcar
- [ ] Layout responsivo mobile first + paleta do tema
- [ ] Loading em toda chamada ao backend
- [ ] Modal único reaproveitado
- [x] Sequelize criando as tabelas (não manual no phpMyAdmin)
- [ ] Nomes em inglês (variáveis, funções, arquivos)
