const { describe } = require('node:test');
const mdLinks = require('../src/md-links.js'); // Importe o arquivo que contém a função receberComandoCLIeIniciarPrograma

//Limpar as variaveis usadas nos testes após a execucão
beforeEach(() => {
  jest.clearAllMocks();
});

describe('md-links', () => {
  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });
})