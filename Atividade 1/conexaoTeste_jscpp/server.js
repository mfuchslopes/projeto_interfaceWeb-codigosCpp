const express = require('express');
const { spawn, spawnSync } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

function getBackendCommand() {
    if (process.platform === 'win32') {
        return path.join(__dirname, 'backend.exe');
    }

    return path.join(__dirname, 'backend');
}
/// compilando o codigo c para nao precisar fazer no terminal
function ensureBackendCompiled() {
    const sourceFile = path.join(__dirname, 'backend.cpp');
    const backendBinary = getBackendCommand();

    if (!fs.existsSync(sourceFile)) {
        throw new Error('Arquivo backend.cpp não encontrado.');
    }

    let needsCompile = true;

    if (fs.existsSync(backendBinary)) {
        const sourceMtime = fs.statSync(sourceFile).mtimeMs;
        const binaryMtime = fs.statSync(backendBinary).mtimeMs;
        needsCompile = sourceMtime > binaryMtime;
    }

    if (!needsCompile) {
        return;
    }

    const outputName = process.platform === 'win32' ? 'backend.exe' : 'backend';
    const compile = spawnSync('g++', ['backend.cpp', '-o', outputName], {
        cwd: __dirname,
        encoding: 'utf8'
    });

    if (compile.error || compile.status !== 0) {
        const stderr = compile.stderr?.trim();
        const stdout = compile.stdout?.trim();
        const details = stderr || stdout || compile.error?.message || 'Erro desconhecido ao compilar backend.cpp';
        throw new Error(details);
    }

    console.log('Backend C++ compilado automaticamente.');
}

// Rota genérica para comunicação com o C++
app.post('/api', (req, res) => {
    const dados = req.body;

    const backendCommand = getBackendCommand();

    const processo = spawn(backendCommand);

    processo.on('error', () => {
        return res.status(500).json({
            erro: 'Não foi possível iniciar o backend nativo. Verifique se o binário existe e tem permissão de execução.'
        });
    });

    let resultado = '';
    let erro = '';

    // Envia dados para o C++ via stdin
    processo.stdin.write(`${dados.row} ${dados.col}`);
    processo.stdin.end();

    // Captura resposta do C++
    processo.stdout.on('data', (data) => {
        resultado += data.toString();
    });

    processo.stderr.on('data', (data) => {
        erro += data.toString();
    });

    processo.on('close', (code) => {
        if (erro) {
            return res.status(500).json({ erro });
        }

        if (code !== 0) {
            return res.status(500).json({ erro: `Backend finalizou com código ${code}` });
        }

        try {
            res.json({ valor: Number(resultado.trim()) });
        } catch {
            res.json({ resposta: resultado });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

try {
    ensureBackendCompiled();
} catch (error) {
    console.error('Falha na compilação automática do backend:', error.message);
    process.exit(1);
}

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});