const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do multer para armazenar os arquivos de áudio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Configuração do Octokit
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function uploadToGitHub(filePath) {
  const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

  await octokit.repos.createOrUpdateFileContents({
    owner: 'FiamaSantos93',
    repo: 'Audios_Sprint_03',
    path: `uploads/${path.basename(filePath)}`,
    message: 'Upload de áudio',
    content: fileContent
  });
}

// Rota para o upload do áudio
app.post('/upload', upload.single('audioFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  try {
    await uploadToGitHub(req.file.path);
    res.status(200).send('Áudio enviado e armazenado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar para o GitHub:', error);
    res.status(500).send('Erro ao enviar o áudio.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
