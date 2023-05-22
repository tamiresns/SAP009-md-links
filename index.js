const fs = require('fs')
const { Command } = require('commander');
const axios = require('axios');

// Referencia da Lib
// https://medium.com/henriquekuwai/criando-sua-cli-com-node-js-d6dee7d03110
const program = new Command();

//variaveis globais para guardar as flags --validade e --stats
let validate = false;
let stats = false;
let arrayLinks = [];
let path = "" ;

function receberComandoCLIeIniciarPrograma() {
  program
  .arguments('<arquivo>')
  .option('--v, --validate', 'Valida os links dos arquivos')
  .option('--s, --stats', 'Muda a saida do programa para um resumo simplificado')
  .action((arg, options) => {
    // caputando os argumentos do cli em variáveis
    path = arg;
    validate = options.validate || false; //se nao informado, define como falso
    stats = options.stats || false; //se nao informado, define como falso
    //chamando meu metodo para processar o arquivo
    mdLinks(path, {"validate":validate, "stats":stats})
  });

  program.parse(process.argv);

}


function mdLinks(path, options) {
  // os o FS (filesystem) para ler o arquivo
  fs.readFile(path, 'utf8', async (err,conteudo) => {

    if(err) {
      console.log('Arquivo nao encontrado')
    } else {
      // divide o arquivo em linha-por-linha
      const lines = conteudo.split('\n');
      verificaSeTemLink(lines)
      await validateLink(options)//esperar a funcao terminar de ser executada
      formatarSaida(options)
    }
  });    
}

function verificaSeTemLink(lines) {
  //regex para testra se tem links no formato []()
  var regex = /\[(.*?)\]\((.*?)\)/;
  for(let i = 0; i<lines.length; i++){
    // Executando a expressão regular na string
    var match = regex.exec(lines[i]);

    // Verificando se houve um match e armazenando o texto e o link em variáveis globais
    if (match && match.length === 3) {
      var text = match[1]; // Extrai o texto do link
      var link = match[2]; // Extrai o link
      arrayLinks.push({"text": text, "link": link})
      }
    }
}


async function validateLink(option){
  if(option.validate){
    const linkPromises = arrayLinks.map(item => acessLink(item));

    await Promise.all(linkPromises)
      .then()
      .catch(error => {
        console.error('Ocorreu um erro ao validar os links:', error);
      });
  }
  
}

function acessLink(item) {
  return new Promise((resolve, reject) => {
    axios.head(item.link)
      .then(response => {
        if (response.status >= 0 && response.status <= 399) {
          item.isValid = true;
          item.httpStatus = response.status;
          resolve(item);
        } else {
          item.isValid = false;
          item.httpStatus = response.status;
          resolve(item);
        }
      })
      .catch(error => {
        item.isValid = false;
        item.httpStatus = 400;
        resolve(item);
    });
  });
}

function formatarSaida(option) {
  if(option.stats){
    outputStats(option);
  }
  else{
    outputList(option);
  }
}

function outputStats(option){
  let totalLinks = `Total: ${arrayLinks.length} \nUnique: ${countUniques()}`
  if(option.validate == true){
    totalLinks = totalLinks + `\nBroken: ${countBrokens()}`
  }
  console.log(totalLinks);

}

function outputList(option){
  
  for(let i = 0; i<arrayLinks.length; i++){
    let stringOutput = ""
    if(option.validate == true) {
      stringOutput = `${path} ${arrayLinks[i].link} ${arrayLinks[i].isValid ? "ok" : "fail"} ${arrayLinks[i].httpStatus} ${arrayLinks[i].text} `
    }
    else {
      stringOutput = `${path} ${arrayLinks[i].link} ${arrayLinks[i].text} `
    }
    console.log(stringOutput)
  }

}

function countUniques(){
  const uniqueLinks = new Set();
  // Percorre o array de objetos
  for (const item of arrayLinks) {
    const link = item.link;
    uniqueLinks.add(link);
  }
  return uniqueLinks.size;
}

function countBrokens(){
  const filteredData = arrayLinks.filter(item => item.isValid === false);
  const countInvalidLinks = filteredData.length;

  return countInvalidLinks;
}

// invoca o programa
module.exports = receberComandoCLIeIniciarPrograma()