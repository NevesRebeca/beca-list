# AGENTS.md

Projeto de estudo fullstack de to-do list. **`beca-list-documentacao.md` é a especificação autoritativa** (stack, API, design) e **`beca-list-checklist.md` acompanha o progresso por fase**. Comentários e documentação ficam em português; **todo identificador de código** (variáveis, funções, arquivos, colunas) **deve ser em inglês**.

## Stack

- `backend/`: Node.js + **Express 5** (ESM, `"type": "module"`) + Sequelize 6 + mysql2 + MySQL (XAMPP).
- `frontend/`: HTML/CSS/JS puro + **Tailwind v4** via `@tailwindcss/browser` CDN (sem build, sem package.json).

## Comandos

- Subir backend: `cd backend; npm run dev` (nodemon, reinicia sozinho) → `http://localhost:3000`.
- **Não há testes** (script `test` é um stub) nem lint/typecheck/formatter. Valide rotas com o servidor rodando / um REST client.

## Backend — pré-requisitos e pegadinhas

- XAMPP **Apache e MySQL** precisam estar rodando; credenciais default são `root` sem senha (ver `backend/.env`).
- O banco `beca_list` é criado **uma vez** no phpMyAdmin; as **tabelas são criadas apenas via `sequelize.sync()`** a partir dos models — nunca manualmente no phpMyAdmin.
- `.env` é gitignored (não commitar). `src/config/database.js` lê `DB_*` dele.
- Hoje só existe `GET /ping`; **não há models/routes/controllers ainda** — implementar seguindo a tabela de endpoints da documentação.
- **Express 5** (sintaxe de rotas/wildcards difere dos exemplos do Express 4).

## Frontend — convenções da especificação

- Sem framework; modal único reaproveitado via `openTaskModal(mode, taskData)`.
- Toda chamada `fetch()` deve ter indicador de loading.
- Tema escuro definido no `index.html` via tokens `@theme` dentro de `<style type="text/tailwindcss">` (sintaxe v4 — **não** usar `tailwind.config`): `--color-bg #201E1D`, `--color-surface #2D2B2B`, `--color-text #F3F2F2`, `--color-divider #605D5D`, `--color-accent #EC3013` (+ `--color-accent-500 #FF563C`, `--color-accent-300 #FFC4B8`), `--color-neutral-400 #BAB6B6` → usar como `bg-surface`, `text-text`, `bg-accent`, etc.
- **A spec (`beca-list-documentacao.md`) descreve o Tailwind v3** (Play CDN + `tailwind.config`); o projeto adotou v4 — divergência conhecida, a spec fica como documento de estudo.
- Mobile first; ícones de prioridade ↑/→/↓; atrasada = `due_date` passada e não concluída.
- Model `Task`: id, title, description, `priority` ENUM (`baixa`/`media`/`alta`, padrão `media` — valores em PT conforme a spec), `due_date`, `completed` (padrão `false`), timestamps. Listagem padrão `createdAt DESC`.

## Observações de estrutura

- `frontend/assets/*.zip` = referência visual (prints do WhatsApp), não é código.
