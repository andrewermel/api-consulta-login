import { Request, Response } from 'express';
import axios from 'axios';


class UserController {
  static async getUserByToken(req: Request, res: Response) {
    try {
      const tokenUser = req.params.token;
      const user = await UserController.getUserByGov(tokenUser);
      // depois de receber o json da api do gov vamos fazer uma chama para api-mesalval para logar 
      if (user) {
        const resposta = await UserController.postUserByMesalva(user);
        //enviar para api-mesalva
        res.json(resposta);
      } else {
        //retorna error
        console.log('Token não encontrado');
        res.status(404).json({ error: 'Token não encontrado' } as any);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter usuário por token' });
    }
  }

  private static async getUserByGov(token: string): Promise<any> {
    try {
      // Substitua 'URL_DA_API_VALIDACAO' pela URL real da API de validação de token
      const validationApiUrl = 'https://validadortoken.educacao.sp.gov.br';
      const response = await axios.post(`${validationApiUrl}/validate`, { token });

      // Retorna verdadeiro se a resposta da API indicar que o token é válido
      return response.data.isValid === true;
    } catch (error) {
      // Lança ou manipula erros durante a validação do token
      console.error('Erro ao validar token:', error);
      throw new Error(`Erro ao validar token: ${error instanceof Error ? error.message : error}`);
    }
  }

  private static async postUserByMesalva(json: string): Promise<any> {
    try {
      // Substitua 'URL_DA_API_MESALVA' pela URL real da API Mesalva
      const mesalvaApiUrl = 'https://www.mesalva.com/app/entrar';
      const response = await axios.post(`${mesalvaApiUrl}`, json, {
        headers: {
          'Content-Type': 'application/json', // Certifique-se de definir o tipo de conteúdo corretamente
        },
      });
  
      // Retorna verdadeiro se a resposta da API indicar que o token é válido
      return response.data;
    } catch (error) {
      // Lança ou manipula erros durante a validação do token
      console.error('Erro ao enviar dados para Mesalva:', error);
      throw new Error(`Erro ao enviar dados para Mesalva: ${error instanceof Error ? error.message : error}`);
    }
  }
  
}

export default UserController;




