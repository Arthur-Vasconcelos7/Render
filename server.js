const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve o index.html da pasta public na raiz (/)
app.use(express.static(path.join(__dirname, "public")));

// Banco simples em memória (reinicia junto com o servidor)
let usuarios = [
  { id: 1, nome: "João" },
  { id: 2, nome: "Maria" },
];

app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.get("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }
  res.json(usuario);
});

app.post("/usuarios", (req, res) => {
  if (!req.body?.nome) {
    return res.status(400).json({ erro: "Campo 'nome' é obrigatório" });
  }
  const novoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    nome: req.body.nome,
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }
  if (!req.body?.nome) {
    return res.status(400).json({ erro: "Campo 'nome' é obrigatório" });
  }
  usuario.nome = req.body.nome;
  res.json(usuario);
});

app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }
  usuarios.splice(index, 1);
  res.json({ mensagem: "Usuário removido" });
});

// O Render define a porta pela variável PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
