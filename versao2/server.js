const http = require('http');
const { URL } = require('url');
const utils = require('./utils');

const servidor = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;
    const metodo = req.method;
    const alunos = utils.carregarAlunos();

    console.log(`\n ${metodo} ${caminho}`);

    // === Rota inicial ===
    if (metodo === "GET" && caminho === "/") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end("API de Alunos - Versão 2.0");
    }

    // === GET /alunos (com filtro ?nome=) ===
    if (metodo === "GET" && caminho === "/alunos") {
        const nomeBuscado = url.searchParams.get("nome");
        if (nomeBuscado) {
            const filtrados = alunos.filter(a =>
                a.nome.toLowerCase().includes(nomeBuscado.toLowerCase())
            );
            return utils.enviarResposta(200, filtrados, res);
        }
        return utils.enviarResposta(200, alunos, res);
    }

    // === GET /alunos/:id ===
    if (metodo === "GET" && /^\/alunos\/\d+$/.test(caminho)) {
        const id = parseInt(caminho.split("/")[2]);
        const aluno = alunos.find(a => a.id === id);
        if (!aluno) return utils.enviarResposta(404, { erro: "Aluno não encontrado" }, res);
        return utils.enviarResposta(200, aluno, res);
    }

    // === POST /alunos ===
    if (metodo === "POST" && caminho === "/alunos") {
        let corpo = "";
        req.on("data", chunk => corpo += chunk);
        req.on("end", () => {
            try {
                const novo = JSON.parse(corpo);
                novo.id = alunos.length ? alunos[alunos.length - 1].id + 1 : 1;
                utils.escreverNoArquivo(novo);
                utils.enviarResposta(201, { mensagem: "Aluno criado com sucesso", novo }, res);
            } catch {
                utils.enviarResposta(400, { erro: "JSON inválido" }, res);
            }
        });
        return;
    }

    // === PUT /alunos/:id (atualizar notas) ===
    if (metodo === "PUT" && /^\/alunos\/\d+$/.test(caminho)) {
        const id = parseInt(caminho.split("/")[2]);
        let corpo = "";
        req.on("data", chunk => corpo += chunk);
        req.on("end", () => {
            try {
                const dados = JSON.parse(corpo);
                const atualizado = utils.atualizarAluno(id, dados);
                if (!atualizado)
                    return utils.enviarResposta(404, { erro: "Aluno não encontrado" }, res);
                utils.enviarResposta(200, { mensagem: "Notas atualizadas", atualizado }, res);
            } catch {
                utils.enviarResposta(400, { erro: "Corpo inválido" }, res);
            }
        });
        return;
    }

    // === GET /alunos/media/:id ===
    if (metodo === "GET" && caminho.startsWith("/alunos/media/")) {
        const id = parseInt(caminho.split("/")[3]);
        const aluno = alunos.find(a => a.id === id);
        if (!aluno) return utils.enviarResposta(404, { erro: "Aluno não encontrado" }, res);
        const resultado = utils.calcularMedia(aluno);
        return utils.enviarResposta(200, resultado, res);
    }

    // === GET /alunos/ordenados ===
    if (metodo === "GET" && caminho === "/alunos/ordenados") {
        const ordenados = alunos
            .map(a => utils.calcularMedia(a))
            .sort((a, b) => b.media - a.media);
        return utils.enviarResposta(200, ordenados, res);
    }

    // === GET /alunos/ranking (3 melhores) ===
    if (metodo === "GET" && caminho === "/alunos/ranking") {
        const ranking = alunos
            .map(a => utils.calcularMedia(a))
            .sort((a, b) => b.media - a.media)
            .slice(0, 3);
        return utils.enviarResposta(200, ranking, res);
    }

    // === GET /alunos/aprovados ===
    if (metodo === "GET" && caminho === "/alunos/aprovados") {
        const aprovados = alunos
            .map(a => utils.calcularMedia(a))
            .filter(a => a.situacao === "Aprovado");
        return utils.enviarResposta(200, aprovados, res);
    }

    // === GET /alunos/reprovados ===
    if (metodo === "GET" && caminho === "/alunos/reprovados") {
        const reprovados = alunos
            .map(a => utils.calcularMedia(a))
            .filter(a => a.situacao === "Reprovado");
        return utils.enviarResposta(200, reprovados, res);
    }

    // === PUT /alunos/recuperacao/:id ===
    if (metodo === "PUT" && caminho.startsWith("/alunos/recuperacao/")) {
        const id = parseInt(caminho.split("/")[3]);
        const atualizado = utils.recalcularSituacao(id);
        if (!atualizado)
            return utils.enviarResposta(404, { erro: "Aluno não encontrado" }, res);
        return utils.enviarResposta(200, { mensagem: "Média e situação recalculadas", atualizado }, res);
    }

    // === Rota não encontrada ===
    utils.enviarResposta(404, { erro: "Rota não encontrada" }, res);
});

servidor.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
