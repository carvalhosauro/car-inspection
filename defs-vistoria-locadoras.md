## **Semana 1 - Perguntas para a Definição do Projeto.**

### **Nome dos Integrantes da Equipe:**

* Quais são os nomes completos dos membros da equipe?

  ALDARLENE DA SILVA PEIXOTO,

  GUSTAVO OLIVEIRA DE CARVALHO,

  GUSTAVO NASCIMENTO DE FREITAS MESQUITA.

### **Tema:**

* Qual é o tema central que sua equipe escolheu para a aplicação web e mobile? Seja o mais específico possível.

  GESTÃO E AUDITORIA DE VISTORIAS VEICULARES PARA LOCADORAS DE AUTOMÓVEIS.

* Por que este tema é relevante para o contexto atual e para o seu público-alvo?

  A VISTORIA DE RETIRADA E DEVOLUÇÃO É O PRINCIPAL PONTO DE DISPUTA ENTRE LOCADORA E CLIENTE. UMA VISTORIA PADRONIZADA E COMPROVADA PROTEGE A LOCADORA DE PREJUÍZO COM AVARIAS NÃO REGISTRADAS E DÁ AO GESTOR CONTROLE REAL DO ESTADO DA FROTA.

### **Problemática:**

* Qual problema específico sua aplicação busca resolver? Descreva a problemática de forma clara e detalhada.

  VISTORIAS FEITAS DE FORMA INCOMPLETA, NEGLIGENTE OU FRAUDADA: AVARIAS (RISCOS, AMASSADOS, FALTA DE ITENS) DEIXAM DE SER REGISTRADAS NA RETIRADA OU DEVOLUÇÃO, GERANDO PREJUÍZO PARA A LOCADORA, COBRANÇAS INDEVIDAS AO CLIENTE E DISPUTAS SEM PROVA DE QUEM CAUSOU O DANO.

* Quem é o público-alvo afetado por essa problemática? Descreva suas características e necessidades.

  GESTORES DE FROTA E SUPERVISORES DE PÁTIO DE LOCADORAS DE AUTOMÓVEIS. PRECISAM PADRONIZAR O PROCESSO DE VISTORIA, GARANTIR QUE CADA ETAPA FOI REALMENTE EXECUTADA E TER PROVA DOCUMENTAL (FOTO, PLACA, KM, GEOLOCALIZAÇÃO) DE CADA VISTORIA.

* De que forma essa problemática impacta o mercado, a sociedade ou a área específica?

  PREJUÍZO FINANCEIRO COM AVARIAS NÃO COBRADAS, DESGASTE DA RELAÇÃO COM O CLIENTE POR COBRANÇA SEM PROVA, RETRABALHO E BAIXA CONFIABILIDADE NO CONTROLE DA FROTA.

### **Descrição da Proposta:**

* Qual é a ideia principal da sua aplicação? Descreva o conceito geral da solução que vocês pretendem desenvolver.

  DUAS APLICAÇÕES INTEGRADAS. NO ADMIN **WEB**, O GESTOR CRIA MODELOS DE CHECKLIST DE VISTORIA COM REQUISITOS DE COMPROVAÇÃO (FOTO OBRIGATÓRIA, OCR DE PLACA/HODÔMETRO, CÓDIGO ÚNICO, GEOLOCALIZAÇÃO), CADASTRA A FROTA E OS VISTORIADORES, ACOMPANHA E AUDITA AS VISTORIAS. NO **MOBILE**, O VISTORIADOR INTERNO EXECUTA A VISTORIA DE CADA VEÍCULO SEGUINDO O CHECKLIST, CAPTURANDO FOTOS VALIDADAS POR IA E LENDO PLACA E QUILOMETRAGEM POR OCR.

* Como essa aplicação, em linhas gerais, pretende resolver a problemática identificada?

  CADA ITEM DA VISTORIA SÓ É CONSIDERADO CONCLUÍDO COM UM SEGUNDO FATOR DE COMPROVAÇÃO. ISSO PADRONIZA O PROCESSO, IMPEDE QUE ETAPAS SEJAM "MARCADAS" SEM EXECUÇÃO REAL E DEIXA UM LAUDO RASTREÁVEL QUE PROTEGE LOCADORA E CLIENTE.

* Quais são as funcionalidades iniciais e essenciais que vocês visualizam para a aplicação (web e/ou mobile) para atacar essa problemática?

  **WEB**: criação de modelos de checklist de vistoria com requisitos de comprovação; cadastro da frota (veículos) e de vistoriadores; atribuição/agendamento de vistorias; monitoramento das vistorias em andamento; auditoria e aprovação das não conformidades; relatórios e insights.

  **MOBILE**: ver vistorias do dia atribuídas; executar o checklist da vistoria; capturar fotos validadas por IA; ler placa e hodômetro por OCR; justificar item não conforme; concluir com código único; consultar histórico pessoal de vistorias.

### **Tecnologias envolvidas (IA):**

* Qual(is) tecnologia(s) sua aplicação visa utilizar no campo escolhido? Ex: (1. Automação de tarefas repetitivas 2. Assistência na criação de conteúdo 3. Atendimento ao cliente (Chatbots) 4. Análise de dados e insights 5. Tomada de decisão orientada 6. Personalização de experiências…)

  VALIDAÇÃO E AUTOMAÇÃO POR IA APLICADA À VISTORIA:
  1. **VALIDAÇÃO DE FOTO (VISÃO COMPUTACIONAL)**: A IA CONFIRMA QUE A FOTO MOSTRA O ITEM CORRETO DO CHECKLIST, ESTÁ NÍTIDA E NÃO É DUPLICADA/REUSADA ANTES DE ACEITAR A CONCLUSÃO DO ITEM.
  2. **OCR DE PLACA E HODÔMETRO**: A IA LÊ AUTOMATICAMENTE A PLACA E A QUILOMETRAGEM A PARTIR DA FOTO E PREENCHE OS CAMPOS, REDUZINDO DIGITAÇÃO E ERRO MANUAL.
  ALÉM DISSO, OS DADOS GERAM INSIGHTS PARA TOMADA DE DECISÃO DO GESTOR (CARROS COM MAIS AVARIAS, PENDÊNCIAS POR VISTORIADOR, TEMPO MÉDIO DE VISTORIA).

* De que maneira a sua aplicação contribuirá para alcançar melhorias no campo escolhido? Seja direto e explícito na conexão entre a funcionalidade da aplicação e o objetivo da sua aplicação/projeto.

  OS REQUISITOS DE CONCLUSÃO (FOTO VALIDADA POR IA, OCR DE PLACA/KM, CÓDIGO ÚNICO E GEOLOCALIZAÇÃO) EXIGEM UM SEGUNDO FATOR QUE COMPROVE A EXECUÇÃO REAL DE CADA ITEM. A VALIDAÇÃO POR IA IMPEDE FOTO GENÉRICA, BORRADA OU REAPROVEITADA. LOGO, CADA VISTORIA TEM PROVA CONFIÁVEL, REDUZINDO FRAUDE, PREJUÍZO E DISPUTA.

---

## **Semana 2 - Detalhamento Web e Mobile**

### **Estrutura das Páginas / Telas Iniciais e Funcionalidades Essenciais**

#### **Para o Aplicativo Mobile:**

**1. Fluxo do Usuário:**

Vistoriador interno abre o app → faz **login** → vê o **dashboard com as vistorias do dia** atribuídas a ele → seleciona um veículo e abre a **OS de vistoria** → percorre o **checklist** item a item → em cada item captura a **foto** (validada por IA) e, quando exigido, lê **placa/hodômetro por OCR** → se um item não passa, registra **justificativa de não conformidade** → revisa o **resumo** → **conclui** a vistoria com código único e geolocalização → consulta o resultado no **histórico pessoal**.

**2. Telas Essenciais (10 contáveis):**

1. **Login** — Autenticação do vistoriador. Elementos: campo usuário/senha, botão entrar, recuperar senha. Objetivo: dar acesso seguro e identificar quem executou a vistoria.
2. **Dashboard / Vistorias do Dia** — Lista dos veículos a vistoriar hoje. Elementos: cards de veículo (placa, modelo, tipo de vistoria, status), filtro pendentes/concluídas. Objetivo: orientar o trabalho do dia.
3. **Detalhe do Veículo / OS de Vistoria** — Dados do carro e da ordem. Elementos: ficha do veículo, tipo de vistoria (retirada/devolução/periódica), botão iniciar. Objetivo: confirmar o veículo correto antes de começar.
4. **Checklist da Vistoria** — Lista dos itens a cumprir. Elementos: itens com status (pendente/conforme/não conforme), indicação de requisito (foto, OCR, geo), barra de progresso. Objetivo: guiar a execução padronizada.
5. **Captura de Foto do Item** — Câmera com validação por IA. Elementos: câmera, guia de enquadramento, retorno da IA (aceita/rejeita com motivo), refazer. Objetivo: garantir prova válida de cada item.
6. **Leitura OCR Placa/Hodômetro** — Leitura automática por foto. Elementos: câmera, campos preenchidos pela IA, confirmar/corrigir. Objetivo: registrar placa e km sem digitação e sem erro.
7. **Justificativa de Não Conformidade** — Registro de item reprovado. Elementos: seleção do problema, foto da avaria, campo de texto. Objetivo: documentar avarias e itens faltantes.
8. **Revisão / Resumo da Vistoria** — Conferência antes de enviar. Elementos: lista de itens com fotos, pendências destacadas, editar item. Objetivo: evitar envio incompleto.
9. **Conclusão da Vistoria** — Fechamento com comprovação. Elementos: código único, captura de geolocalização, assinatura/confirmação, botão concluir. Objetivo: selar a vistoria de forma rastreável.
10. **Histórico Pessoal** — Vistorias realizadas pelo usuário. Elementos: lista por data/veículo/status, busca, abrir laudo. Objetivo: consulta e prestação de contas do próprio trabalho.

*(Complementares — não contam: Onboarding, Configurações, Notificações/Alertas, Ajuda/FAQ.)*

**3. Ações do Usuário:**

Fazer login; ver vistorias atribuídas; iniciar vistoria; percorrer checklist; capturar fotos validadas por IA; ler placa/km por OCR; justificar não conformidade; revisar; concluir com código único e geolocalização; consultar histórico.

**4. Funcionalidades MVP:**

Login; lista de vistorias atribuídas; execução do checklist com captura de foto validada por IA; OCR de placa/hodômetro; justificativa de não conformidade; conclusão da vistoria. (Histórico e onboarding ficam após o MVP.)

**5. Relação com a problemática e o impacto:**

Cada item só fecha com prova validada, então a vistoria deixa de ser "marcada no olho". Isso ataca diretamente a fraude e a negligência, gerando laudo confiável que reduz prejuízo e disputa.

#### **Para o Sistema Web:**

**1. Papel do Sistema Web:**

Painel gerencial da locadora. Usado por **gestor de frota** e **supervisor de pátio** para definir como a vistoria deve ser feita (modelos de checklist), cadastrar frota e vistoriadores, atribuir e monitorar vistorias, auditar não conformidades e extrair insights.

**2. Telas Essenciais (10 contáveis):**

1. **Login / Autenticação** — Acesso do gestor. Elementos: login, controle de acesso por perfil. Objetivo: proteger dados da operação.
2. **Dashboard Frota + Vistorias** — Visão geral. Elementos: indicadores (vistorias do dia, pendências, carros com avaria), gráficos resumo. Objetivo: leitura rápida da situação.
3. **Gestão de Veículos (Frota)** — Cadastro/edição da frota. Elementos: tabela de veículos (placa, modelo, ano, km, status), CRUD. Objetivo: manter a base de carros atualizada.
4. **Gestão de Modelos de Checklist** — Criação dos roteiros de vistoria. Elementos: editor de itens, definição de requisitos por item (foto, OCR, geo, código). Objetivo: padronizar a vistoria.
5. **Gestão de Vistoriadores** — Cadastro e atribuições da equipe. Elementos: tabela de vistoriadores, vínculo a vistorias, status. Objetivo: organizar quem faz o quê.
6. **Agendamento / Atribuição de Vistorias** — Distribuição do trabalho. Elementos: criar vistoria (veículo + tipo + vistoriador + data), calendário/lista. Objetivo: planejar a operação.
7. **Monitoramento de Vistorias em Andamento** — Acompanhamento ao vivo. Elementos: lista por status, progresso do checklist, atrasos. Objetivo: visibilidade da execução em tempo real.
8. **Detalhe da Vistoria / Laudo** — Resultado completo. Elementos: fotos, leituras OCR, geolocalização, itens conforme/não conforme. Objetivo: prova documental da vistoria.
9. **Auditoria / Aprovação de Não Conformidades** — Revisão gerencial. Elementos: fila de pendências, validações da IA, aprovar/reprovar/reabrir. Objetivo: fechar disputas com base em evidência.
10. **Relatórios e Gráficos (Insights)** — Análise de dados. Elementos: filtros, gráficos (avarias por veículo, pendências por vistoriador, tempo médio), exportação. Objetivo: apoiar a tomada de decisão.

*(Complementares — não contam: Configurações, Notificações/Alertas, Ajuda/FAQ.)*

**3. Ações do Administrador:**

Visualizar dashboards; cadastrar/editar veículos; criar modelos de checklist e seus requisitos; cadastrar vistoriadores e atribuir vistorias; monitorar execução; abrir laudos; auditar e aprovar/reprovar não conformidades; gerar e exportar relatórios.

**4. Funcionalidades MVP:**

Login com controle de acesso; cadastro de veículos; criação de modelo de checklist; atribuição de vistoria; visualização do laudo da vistoria com fotos e OCR. (Insights avançados e auditoria refinada após o MVP.)

**5. Relação com a problemática e o impacto:**

O gestor define o padrão de vistoria e enxerga a prova de cada execução. Auditoria e laudo com evidência reduzem cobrança indevida, prejuízo e disputa, elevando o controle da frota.

---

### **API e Dados: Mobile e Web**

**1. Dados Compartilhados (atributos-chave):**

* **Veículo:** id, placa, modelo, ano, cor, km atual, status (disponível/locado/em manutenção).
* **ModeloChecklist:** id, nome, lista de itens, requisitos por item (foto, OCR, geo, código único).
* **Vistoria:** id, veículo, vistoriador, tipo (retirada/devolução/periódica), data/hora, status, resultado, geolocalização, código único.
* **ItemVistoria:** id, vistoria, item do checklist, status (conforme/não conforme), URL da foto, resultado da validação da IA, dados do OCR (placa/km), justificativa.
* **Vistoriador:** id, nome, login, vistorias atribuídas.

**2. API:**

Uma **API REST única** atua como ponte entre mobile e web. O backend e o banco de dados são compartilhados: o app mobile envia as vistorias e fotos; o sistema web consulta e gerencia os mesmos dados pela mesma API.
