# API de Gerenciamento de Alunos

## Sobre o Projeto
Esta API permite realizar operações CRUD (Create, Read, Update, Delete) em alunos, além de aplicar lógica de cálculo de médias e determinar situações de aprovação/reprovação automaticamente.

## Funcionalidades
### Versão 1.0
- GET /alunos → Lista todos os alunos

- POST /alunos → Cadastra um novo aluno

- GET /alunos/:id → Retorna um aluno específico

- GET /alunos/media/:id → Calcula média e retorna situação (aprovado/reprovado)

- PUT /alunos/:id → Atualiza dados do aluno (incluindo notas)

### Versão 2.0
- GET /alunos/ordenados → Retorna lista de alunos ordenada por média (decrescente)

- GET /alunos?nome=Maria → Filtra alunos por nome

- GET /alunos/ranking → Retorna os 3 melhores alunos (maiores médias)

- GET /alunos/aprovados → Retorna lista de alunos aprovados (média ≥ 7)

- GET /alunos/reprovados → Retorna lista de alunos reprovados (média < 7)

- PUT /alunos/recuperacao/:id → Atualiza média e situação automaticamente

## Estrutura do Aluno
Cada aluno possui os seguintes campos:

```json
{
  "id": 1,
  "nome": "João Silva",
  "nota1": 8.5,
  "nota2": 7.0,
  "nota3": 9.0,
}
```

## Como Usar
---
Execução
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Execute a aplicação - versão 1
node ./versao1/server.js

# Execute a aplicação - versão 2
node ./versao2/server.js

```
## 📈 Versões
v1: Funcionalidades básicas de CRUD e cálculo de médias

v2: Filtros, ordenação, ranking e endpoints específicos