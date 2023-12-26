const express = require('express');
const axios = require('axios');
const jwt = require('./token_decoder')
const app = express();
const PORT = 3000;
const render_files = ["pdf", "ogg", "png", "jpg", "jpeg"]

app.get('/health-check', async (req, res) => {
  res.status(200).send("Servidor funcionando!");
});

app.get('/files/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const GOOGLE_STORAGE_URL = new jwt().decodeToken(token)["url"]

    const response = await axios.get(GOOGLE_STORAGE_URL, { responseType: 'stream' });
    const contentType = response.headers['content-type'];
    const directory_name = GOOGLE_STORAGE_URL.split("?")[0]
    const filename = directory_name.slice(91);
    const extension = directory_name.split(".")[3]
    console.log(extension)
    if(render_files.includes(extension)){
      response.data.pipe(res);
    }else {
      res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

      response.data.pipe(res);
    }
  } catch (error) {
    console.error('Erro ao fazer a requisição para o Google Storage:', error);
    res.status(500).send('Erro interno do servidor' + error);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
