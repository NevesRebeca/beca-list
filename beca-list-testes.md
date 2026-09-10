# 🧪 Checklist de Testes — beca-list

> Percorra tudo antes de pedir para alguém testar. Marque `[x]` conforme validar.
> Teste em pelo menos 2 tamanhos de tela: mobile (redimensiona a janela ou usa o modo responsivo do DevTools) e desktop (janela larga).

## Ambiente
- [ ] XAMPP com Apache e MySQL rodando (verde)
- [ ] Backend rodando sem erro no terminal (`npm run dev`)
- [ ] `http://localhost:3000/tasks` responde no navegador/Postman
- [ ] Frontend abre sem erro no Console (`F12`)

## Criar tarefa
- [ ] Botão "Nova tarefa" abre o modal (mobile: sobe do rodapé / desktop: centralizado)
- [ ] Criar com só o título preenchido (campos opcionais vazios) → funciona
- [ ] Criar com todos os campos preenchidos (título, descrição, data, prioridade) → funciona
- [ ] Tentar criar sem título → mostra erro, não quebra a tela
- [ ] Cada uma das 3 prioridades (alta/média/baixa) salva corretamente
- [ ] Tarefa criada aparece na lista sem precisar recarregar a página
- [ ] Loading (foto girando) aparece durante a criação

## Listar tarefas
- [ ] Lista carrega ao abrir a página
- [ ] Cards mostram: checkbox, título, descrição, badge de data, badge de prioridade, ícone de seta
- [ ] Datas aparecem formatadas (HOJE / AMANHÃ / dia + mês)
- [ ] Tarefa atrasada mostra o badge "ATRASADA"
- [ ] Tarefa com due_date de hoje NÃO aparece como atrasada

## Editar tarefa
- [ ] Clicar no card (mobile) ou botão "Editar" (desktop) abre o modal preenchido
- [ ] Todos os campos vêm com os valores corretos da tarefa
- [ ] Prioridade correta já aparece destacada
- [ ] Alterar um campo e salvar → atualiza (não cria uma tarefa nova)
- [ ] Editar duas tarefas seguidas → cada uma edita a tarefa certa, sem misturar

## Concluir/desmarcar tarefa
- [ ] Clicar no checkbox marca como concluída (título riscado, esmaecido)
- [ ] Clicar de novo desmarca (volta ao normal)
- [ ] Clicar no checkbox NÃO abre o modal de edição
- [ ] Clicar em qualquer outra parte do card SIM abre o modal

## Excluir tarefa
- [ ] Botão excluir (dentro do modal, mobile) pede confirmação
- [ ] Botão excluir (na linha, desktop) pede confirmação
- [ ] Cancelar a confirmação → tarefa continua existindo
- [ ] Confirmar → tarefa some da lista e do banco

## Busca
- [ ] Digitar no campo de busca filtra por título após uma pausa (debounce)
- [ ] Busca funciona igual no campo mobile e no campo desktop
- [ ] Buscar um termo sem resultado → lista fica vazia, sem erro
- [ ] Limpar a busca → volta a mostrar todas as tarefas

## Paginação
- [ ] Com mais de 5 tarefas, botão "Carregar mais" aparece
- [ ] Clicar nele acrescenta as próximas tarefas (sem apagar as já visíveis)
- [ ] Quando não há mais tarefas, o botão some
- [ ] Trocar de filtro ou busca reseta a paginação para a primeira página

## Filtros e contadores
- [ ] Chip "Todas" mostra tudo
- [ ] Chip "Hoje" mostra só tarefas de hoje
- [ ] Chip "Prioridade alta" mostra só as de prioridade alta
- [ ] Chip "Concluídas" mostra só as concluídas
- [ ] Alternar entre chips troca o destaque visual corretamente
- [ ] Header mobile ("Em aberto" / "Para hoje") mostra números corretos
- [ ] Header desktop ("Tarefas · N em aberto") mostra número correto
- [ ] Contadores dos chips no desktop (Todas · N, Hoje · N, etc.) batem com a lista
- [ ] "N Atrasadas" no desktop bate com a quantidade real de atrasadas

## Loading
- [ ] Loading aparece ao carregar a lista
- [ ] Loading aparece ao criar/editar/excluir/concluir uma tarefa
- [ ] Loading sempre some depois (nunca fica travado na tela)

## Responsividade
- [ ] Redimensionar a janela de mobile para desktop e vice-versa não quebra nada
- [ ] Modal muda de "bottom sheet" (mobile) para "centralizado" (desktop)
- [ ] Cards mudam de "empilhado" (mobile) para "linha horizontal" (desktop)
- [ ] Botão fixo "Nova tarefa" some no desktop (já existe no header)

## Casos extremos
- [ ] Título bem longo não quebra o layout do card
- [ ] Descrição bem longa é cortada (não estica o card)
- [ ] Criar várias tarefas rápido, sem esperar uma terminar, não gera comportamento estranho
- [ ] Recarregar a página (F5) com o modal aberto — comportamento aceitável (fecha ou mantém, sem travar)
