const express = require('express');
const app = express();
const port = 3001; 

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend de Gestion-Entrepot!');
});

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur http://localhost:${port}`);
});
