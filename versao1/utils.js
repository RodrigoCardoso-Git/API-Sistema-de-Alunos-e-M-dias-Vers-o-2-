const fs = require("fs");
const DB = './versao1/alunos.json';

// === Função para carregar alunos ===
function carregarAlunos() {
    if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]", "utf8");
    return JSON.parse(fs.readFileSync(DB, "utf8"));
}

// === Função para enviar resposta JSON ===
function enviarResposta(status, dados, res) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dados));
}

// === Função para salvar novo aluno ===
function escreverNoArquivo(novoAluno) {
    const alunos = carregarAlunos();
    alunos.push(novoAluno);
    fs.writeFileSync(DB, JSON.stringify(alunos, null, 2));
}

// === Função para calcular média e situação ===
function calcularMedia(idAluno) {
    const lista = carregarAlunos();
    const aluno = lista.find(a => a.id === idAluno);
    if (!aluno) return null;

    const media = (aluno.nota1 + aluno.nota2 + aluno.nota3) / 3;
    const situacao = media >= 7 ? "Aprovado" : "Reprovado";

    return { nome: aluno.nome, media: media.toFixed(2), situacao };
}

// === Função para atualizar notas ===
function atualizarAluno(id, novosDados) {
    const lista = carregarAlunos();
    const index = lista.findIndex(a => a.id === id);
    if (index === -1) return null;

    lista[index] = { ...lista[index], ...novosDados };
    fs.writeFileSync(DB, JSON.stringify(lista, null, 2));
    return lista[index];
}

module.exports = { carregarAlunos, enviarResposta, escreverNoArquivo, calcularMedia, atualizarAluno };
