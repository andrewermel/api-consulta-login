import express, { Request, Response } from 'express';
import UserController from './controllers/UserController';

const app = express();
const port = 3000;

app.use(express.json());

// Rota para obter usuário por email
app.get('/user/:token', UserController.getUserByToken);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
