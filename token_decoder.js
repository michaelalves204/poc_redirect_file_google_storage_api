const jwt = require('jsonwebtoken');

class TokenDecoder {
  constructor() {
    this.secret = "secret";
  }

  decodeToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret);
      return decoded;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      throw new Error('Erro ao decodificar o token');
    }
  }
}

module.exports = TokenDecoder;
