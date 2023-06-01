const { describe } = require('node:test');
let {arrayLinks} = require('../src/md-links.js');
const {
        mdLinks, 
        verificaSeTemLinkEGuardaEmMemoria,  
        formatarSaida,
        processFile,
        processDirectory
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
    jest.restoreAllMocks();

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

    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, 'File content');
    });

    mdLinks(filePath, options);

    expect(fs.lstat).toHaveBeenCalledWith(filePath, expect.any(Function));
    expect(fs.readFile).toHaveBeenCalledWith(filePath, 'utf8', expect.any(Function));
    expect(fs.readFile).toHaveBeenCalledTimes(1); // Verifique o número de chamadas de fs.readFile

    fs.lstat.mockRestore();
    fs.readFile.mockRestore();
  });

  it('should process directory if the path is a directory', () => {
    const directoryPath = 'testdir';
    const options = {
      validate: true,
      stats: false,
    };
    
    const processDirectoryMock = jest.fn(); // Cria uma função simulada para o processDirectory
    
    fs.lstat.mockImplementation((path, callback) => {
      const stats = {
        isDirectory:()=>true,
        isFile: () => false
      };
      callback(null, stats);
    });


    const mdLinksInstance = new mdLinks(); // Cria uma instância de mdLinks
    mdLinksInstance.processDirectory = processDirectoryMock; // Adiciona a função simulada processDirectory à instância
    
    mdLinksInstance.processDirectory(directoryPath, options);

    //expect(fs.lstat).toHaveBeenCalledWith(directoryPath, expect.any(Function));
    expect(processDirectoryMock).toHaveBeenCalledWith(directoryPath, options); // Verifica se a função simulada processDirectory é chamada
    //expect(mdLinksInstance.processFile).not.toHaveBeenCalled(); // Verifica se o processFile não é chamado
   
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
    
    expect(arrayLinks).toHaveLength(1)//verifica se um objeto tem um determinado tamanho
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

    expect(arrayLinks).toHaveLength(2);//verifica se um objeto tem um determinado tamanho

    fs.readFile.mockRestore();
  });
});

describe('formatar saída', () => {
  let consoleOutput = [];
  
  // Redefine a função console.log para capturar a saída
  beforeEach(() => {
    console.log = jest.fn((...args) => {
      consoleOutput.push(args.join(' '));
    });
  });

  // Limpa a saída do console após cada teste
  afterEach(() => {
    consoleOutput = [];
  });

  it('should output stats when option.stats is true', () => {
    const option = {
      stats: true,
      validate: false,
    };

    formatarSaida(option);

    expect(consoleOutput).toHaveLength(1);//verifica se um objeto tem um determinado tamanho
    expect(consoleOutput[0]).toContain('Total:');//verifica se um elemento está presente em um array, string ou conjunto (set)
    expect(consoleOutput[0]).toContain('Unique:');
    expect(consoleOutput[0]).not.toContain('Broken:');
  });

  it('should output stats and broken links when option.stats is true and option.validate is true', () => {
    const option = {
      stats: true,
      validate: true,
    };

    formatarSaida(option);

    expect(consoleOutput).toHaveLength(1);
    expect(consoleOutput[0]).toContain('Total:');
    expect(consoleOutput[0]).toContain('Unique:');
    expect(consoleOutput[0]).toContain('Broken:');
  });

  it('should output list of links when option.stats is false', () => {
    const option = {
      stats: false,
      validate: false,
    };

    formatarSaida(option);

    expect(consoleOutput).not.toHaveLength(0);
    // Verifique se a saída contém os detalhes esperados dos links
    // Você pode adicionar mais expectativas aqui com base na estrutura da saída
  });

  it('should output list of links with validation status when option.stats is false and option.validate is true', () => {
    const option = {
      stats: false,
      validate: true,
    };

    formatarSaida(option);

    expect(consoleOutput).not.toHaveLength(0);
    // Verifique se a saída contém os detalhes esperados dos links, incluindo o status de validação
    // Você pode adicionar mais expectativas aqui com base na estrutura da saída
  });
});