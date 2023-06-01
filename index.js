#!/usr/bin/env node
const { Command } = require('commander');
const { mdLinks } = require('./src/md-links.js');

// Referencia da Lib
// https://medium.com/henriquekuwai/criando-sua-cli-com-node-js-d6dee7d03110
const program = new Command();
function receberComandoCLIeIniciarPrograma() {
  program
  .arguments('<arquivo>')
  .option('--v, --validate', 'Valida os links dos arquivos')
  .option('--s, --stats', 'Muda a saida do programa para um resumo simplificado')
  .action((arg, options) => {
    opts = { 
            "validate": options.validate || false, 
             "stats": options.stats || false
           } 
    mdLinks(arg, opts)
  })
  .parse(process.argv);
}


  // invoca o programa
  receberComandoCLIeIniciarPrograma()