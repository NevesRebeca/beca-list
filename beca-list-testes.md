# 🧪 Checklist de Testes — beca-list

> Percorra tudo antes de pedir para alguém testar. Marque `[x]` conforme validar.
> Teste em pelo menos 2 tamanhos de tela: mobile (redimensiona a janela ou usa o modo responsivo do DevTools) e desktop (janela larga).

## Ambiente

- [x] XAMPP com Apache e MySQL rodando (verde)
- [x] Backend rodando sem erro no terminal (`npm run dev`)
- [x] `http://localhost:3000/tasks` responde no navegador/Postman
- [x] Frontend abre sem erro no Console (`F12`)

## Criar tarefa

- [x] Botão "Nova tarefa" abre o modal (mobile: sobe do rodapé / desktop: centralizado)
- [x] Criar com só o título preenchido (campos opcionais vazios) → funciona
- [x] Criar com todos os campos preenchidos (título, descrição, data, prioridade) → funciona
- [x] Tentar criar sem título → mostra erro, não quebra a tela [1!WARNING]
- [x] Cada uma das 3 prioridades (alta/média/baixa) salva corretamente
- [x] Tarefa criada aparece na lista sem precisar recarregar a página
- [x] Loading (foto girando) aparece durante a criação NÃO ENTENDI

[1!WARNING] Não está mostrando o erro - voltar na documentação e conferir, porque acredito que o título é obrigatório -> resolvido (back e frontend)

## Listar tarefas

- [x] Lista carrega ao abrir a página
- [x] Cards mostram: checkbox, título, descrição, badge de data, badge de prioridade, ícone de seta
- [x] Datas aparecem formatadas (HOJE / AMANHÃ / dia + mês)
- [x] Tarefa atrasada mostra o badge "ATRASADA"
- [x] Tarefa com due_date de hoje NÃO aparece como atrasada

## Editar tarefa

- [x] Clicar no card (mobile) ou botão "Editar" (desktop) abre o modal preenchido
- [x] Todos os campos vêm com os valores corretos da tarefa
- [ ] Prioridade correta já aparece destacada
- [x] Alterar um campo e salvar → atualiza (não cria uma tarefa nova)
- [x] Editar duas tarefas seguidas → cada uma edita a tarefa certa, sem misturar

## Concluir/desmarcar tarefa

- [x] Clicar no checkbox marca como concluída (título riscado, esmaecido)
- [x] Clicar de novo desmarca (volta ao normal)
- [x] Clicar no checkbox NÃO abre o modal de edição
- [x] Clicar em qualquer outra parte do card SIM abre o modal

## Excluir tarefa

- [x] Botão excluir (dentro do modal, mobile) pede confirmação
- [x] Botão excluir (na linha, desktop) pede confirmação
- [x] Cancelar a confirmação → tarefa continua existindo
- [x] Confirmar → tarefa some da lista e do banco

## Busca

- [x] Digitar no campo de busca filtra por título após uma pausa (debounce)
- [x] Busca funciona igual no campo mobile e no campo desktop
- [x] Buscar um termo sem resultado → lista fica vazia, sem erro
- [x] Limpar a busca → volta a mostrar todas as tarefas

## Paginação

- [x] Com mais de 5 tarefas, botão "Carregar mais" aparece
- [x] Clicar nele acrescenta as próximas tarefas (sem apagar as já visíveis)
- [x] Quando não há mais tarefas, o botão some
- [x] Trocar de filtro ou busca reseta a paginação para a primeira página

## Filtros e contadores

- [x] Chip "Todas" mostra tudo
- [x] Chip "Hoje" mostra só tarefas de hoje
- [x] Chip "Prioridade alta" mostra só as de prioridade alta
- [x] Chip "Concluídas" mostra só as concluídas
- [x] Alternar entre chips troca o destaque visual corretamente
- [x] Header mobile ("Em aberto" / "Para hoje") mostra números corretos
- [x] Header desktop ("Tarefas · N em aberto") mostra número correto
- [x] Contadores dos chips no desktop (Todas · N, Hoje · N, etc.) batem com a lista
- [x] "N Atrasadas" no desktop bate com a quantidade real de atrasadas

## Loading

- [x] Loading aparece ao carregar a lista
- [x] Loading aparece ao criar/editar/excluir/concluir uma tarefa
- [x] Loading sempre some depois (nunca fica travado na tela)

## Responsividade

- [x] Redimensionar a janela de mobile para desktop e vice-versa não quebra nada
- [x] Modal muda de "bottom sheet" (mobile) para "centralizado" (desktop)
- [x] Cards mudam de "empilhado" (mobile) para "linha horizontal" (desktop)
- [x] Botão fixo "Nova tarefa" some no desktop (já existe no header)

## Casos extremos

- [x] Título bem longo não quebra o layout do card
- [x] Descrição bem longa é cortada (não estica o card)
- [ ] Criar várias tarefas rápido, sem esperar uma terminar, não gera comportamento estranho
- [x] Recarregar a página (F5) com o modal aberto — comportamento aceitável (fecha ou mantém, sem travar)
