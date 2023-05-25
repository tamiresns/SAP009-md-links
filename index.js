#!/usr/bin/env node
const fs = require('fs')
const path = require('path');
const { Command } = require('commander');
const axios = require('axios');

// Referencia da Lib
// https://medium.com/henriquekuwai/criando-sua-cli-com-node-js-d6dee7d03110
const program = new Command();

//variaveis globais para guardar as flags --validade e --stats
let validate = false;
let stats = false;
let arrayLinks = [];

function receberComandoCLIeIniciarPrograma() {
  program
  .arguments('<arquivo>')
  .option('--v, --validate', 'Valida os links dos arquivos')
  .option('--s, --stats', 'Muda a saida do programa para um resumo simplificado')
  .action((arg, options) => {
    // caputando os argumentos do cli em variáveis
    validate = options.validate || false; //se nao informado, define como falso
    stats = options.stats || false; //se nao informado, define como falso
    //chamando meu metodo para processar o arquivo
    mdLinks(arg, {"validate":validate, "stats":stats})
  });

  program.parse(process.argv);

}


function mdLinks(path, options) {
  // os o FS (filesystem) para ler o arquivo
  fs.lstat(path, (err, stats) => {
    if(err) {
      console.log('Erro ao acessar o caminho:', err);
    } else {
      if (stats.isFile()) {
        console.log('[DEBUG] é arquivo')
        // Se for um arquivo, chame a função para processar o arquivo
        processFile(path, options).then(() => formatarSaida(options));
      } else if (stats.isDirectory()) {
        // Se for um diretório, chame a função para processar todos os arquivos do diretório
        console.log('[DEBUG] é diretorio')
        processDirectory(path, options);
      }
    }
  });    
}

function processFile(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, conteudo) => {
      if (err) {
        console.log('Erro ao ler o arquivo:', err);
        resolve();
      } else {
        const lines = conteudo.split('\n');
        verificaSeTemLink(lines)
        validateLink(options)
        .then(() => resolve())
        .catch(error => {
          console.error('Ocorreu um erro ao validar os links:', error);
          resolve();
        });
      }
    });
  })
}

function processDirectory(directoryPath, options) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.log('Erro ao ler o diretório:', err);
    } else {
      const filePromises = files.map(file => {
        const filePath = path.join(directoryPath, file);
        return processFile(filePath, options);
      });

      Promise.all(filePromises)
        .then(() => formatarSaida(options))
        .catch(error => console.error('Ocorreu um erro:', error));
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


function validateLink(option){
  if(option.validate){
    const linkPromises = arrayLinks.map(item => acessLink(item));

    return Promise.all(linkPromises)
  }else{
    return Promise.resolve()
  } 
}

function acessLink(item) {
  return axios.head(item.link)
      .then(response => {
        if (response.status >= 0 && response.status <= 399) {
          item.isValid = true;
          item.httpStatus = response.status;
        } else {
          item.isValid = false;
          item.httpStatus = response.status;
          return item;
        }
      })
      .catch(error => {
        item.isValid = false;
        item.httpStatus = 400;
        return item;
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