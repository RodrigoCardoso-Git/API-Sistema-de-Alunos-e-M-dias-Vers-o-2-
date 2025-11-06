const http = require('http');
const { URL } = require('url');
const utils = require('./utils');

const servidorHttp = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const caminho = url.pathname;
    const metodo = req.method;

    console.log(`\nRequisição recebida: ${metodo} ${caminho}`);
    const alunos = utils.carregarAlunos();

    // Rota inicial
    if (metodo === "GET" && caminho === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Servidor Node - API de Alunos (Versão 1.0)');
    }

    // ========== GET /alunos ==========
    if (metodo === "GET" && caminho === '/alunos') {
        return utils.enviarResposta(200, alunos, res);
    }

    // ========== GET /alunos/:id ==========
    if (metodo === "GET" && /^\/alunos\/\d+$/.test(caminho)) {
        const id = parseInt(caminho.split('/')[2]);
        const aluno = alunos.find(a => a.id === id);

        if (!aluno) return utils.enviarResposta(404, { erro: 'Aluno não encontrado' }, res);
        return utils.enviarResposta(200, aluno, res);
    }

    // ========== GET /alunos/media/:id ==========
    if (metodo === "GET" && caminho.startsWith('/alunos/media/')) {
        const id = parseInt(caminho.split('/')[3]);
        const resultado = utils.calcularMedia(id);
        if (!resultado) return utils.enviarResposta(404, { erro: 'Aluno não encontrado' }, res);
        return utils.enviarResposta(200, resultado, res);
    }

    // ========== POST /alunos ==========
    if (metodo === "POST" && caminho === '/alunos') {
        let corpo = '';
        req.on('data', chunk => corpo += chunk);
        req.on('end', () => {
            try {
                const novo = JSON.parse(corpo);
                novo.id = alunos.length ? alunos[alunos.length - 1].id + 1 : 1;
                utils.escreverNoArquivo(novo);
                utils.enviarResposta(201, { mensagem: 'Aluno criado com sucesso', novo }, res);
            } catch (err) {
                utils.enviarResposta(400, { erro: 'JSON inválido' }, res);
            }
        });
        return;
    }

    // ========== PUT /alunos/:id ==========
    if (metodo === "PUT" && /^\/alunos\/\d+$/.test(caminho)) {
        const id = parseInt(caminho.split('/')[2]);
        let corpo = '';

        req.on('data', chunk => corpo += chunk);
        req.on('end', () => {
            try {
                const dados = JSON.parse(corpo);
                const atualizado = utils.atualizarAluno(id, dados);
                if (!atualizado)
                    return utils.enviarResposta(404, { erro: 'Aluno não encontrado' }, res);
                utils.enviarResposta(200, { mensagem: 'Notas atualizadas com sucesso', atualizado }, res);
            } catch {
                utils.enviarResposta(400, { erro: 'Corpo inválido' }, res);
            }
        });
        return;
    }

    // Rota não encontrada
    utils.enviarResposta(404, { erro: 'Rota não encontrada' }, res);
});

servidorHttp.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
