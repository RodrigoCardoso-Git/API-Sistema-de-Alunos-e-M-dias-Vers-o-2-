
const fs = require("fs");
const DB = './versao2/alunos.json';

// === Carregar lista de alunos ===
function carregarAlunos() {
    if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]", "utf8");
    return JSON.parse(fs.readFileSync(DB, "utf8"));
}

// === Enviar resposta HTTP em JSON ===
function enviarResposta(status, dados, res) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dados));
}

// === Salvar novo aluno ===
function escreverNoArquivo(novoAluno) {
    const alunos = carregarAlunos();
    alunos.push(novoAluno);
    fs.writeFileSync(DB, JSON.stringify(alunos, null, 2));
}

// === Atualizar aluno existente ===
function atualizarAluno(id, novosDados) {
    const lista = carregarAlunos();
    const index = lista.findIndex(a => a.id === id);
    if (index === -1) return null;

    lista[index] = { ...lista[index], ...novosDados };
    fs.writeFileSync(DB, JSON.stringify(lista, null, 2));
    return lista[index];
}

// === Calcular média e situação ===
function calcularMedia(aluno) {
    const media = (aluno.nota1 + aluno.nota2 + aluno.nota3) / 3;
    const situacao = media >= 7 ? "Aprovado" : "Reprovado";
    return { ...aluno, media: media.toFixed(2), situacao };
}

// === Recalcular média e situação para um aluno específico ===
function recalcularSituacao(id) {
    const lista = carregarAlunos();
    const index = lista.findIndex(a => a.id === id);
    if (index === -1) return null;

    const atualizado = calcularMedia(lista[index]);
    lista[index] = atualizado;
    fs.writeFileSync(DB, JSON.stringify(lista, null, 2));
    return atualizado;
}

module.exports = {
    carregarAlunos,
    enviarResposta,
    escreverNoArquivo,
    atualizarAluno,
    calcularMedia,
    recalcularSituacao
};
