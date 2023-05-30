const { describe } = require('node:test');
let {arrayLinks} = require('../src/md-links.js');
const {
        mdLinks, 
        verificaSeTemLinkEGuardaEmMemoria, 
        processFile, 
        formatarSaida
} = require('../src/md-links.js'); // Importe o arquivo que contém a função receberComandoCLIeIniciarPrograma


const fs = require('fs');
jest.mock('fs');

//Limpar as variaveis usadas nos testes após a execucão
beforeEach(() => {
  jest.clearAllMocks();
});

describe('md-links', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('should process file if the path is a file', () => {
    const filePath = 'testfile.md';
    const options = {
      validate: true,
      stats: false,
    };

    //mocakndo as respostas
    fs.lstat.mockImplementation((path, callback) => {
      const stats = {
        isFile: () => true,
      };
      callback(null, stats);
    });

    mdLinks(filePath, options)

    expect(fs.lstat).toHaveBeenCalledWith(filePath, expect.any(Function));
    // expect(processFile).toHaveBeenCalledTimes(1)
  });

})

describe('verificaSeTemLinkEGuardaEmMemoria',()=>{
  it('verifica link',()=>{
    const lines = [
      '123', 
      '[Um exemplo de link](https://www.tamirestamires.com/)'
    ]
    //arrayLinks = [];
    verificaSeTemLinkEGuardaEmMemoria('arquivo.md', lines)
    
    expect(arrayLinks).toHaveLength(1)
    expect(arrayLinks[0]).toEqual({
      filePath: 'arquivo.md',
      text: 'Um exemplo de link',
      link: 'https://www.tamirestamires.com/'
    });
  })
})

describe('processFile', () => {
  it('should read and process the file with 2 links', async () => {
    const filePath = 'testfile.txt';
    const fileContent = '[Lalala](https://www.tamirestamires.com/)\n[Link do UOL](https://www.sbt.com.br)';
    //arrayLinks = []
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, fileContent);
    });

    const options = {
      validate: true,
      stats: false,
    };

    await processFile(filePath, options);

    expect(arrayLinks).toHaveLength(2);

    fs.readFile.mockRestore();
  });
  
});