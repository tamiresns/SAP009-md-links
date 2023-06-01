# Markdown Links


## Resumo do projeto

Neste projeto foi criada uma ferramenta de linha de comando (CLI) para procurar links em arquivos markdown e se solicitado, também os valida.

## Instalação

O módulo é instalável através do comando:

    npm install https://github.com/tamiresns/SAP009-md-links/
       
## CLI (Interface de Linha de Comando)

Quando apenas entregamos o caminho do arquivo (caminho abaixo), o comportamento esperado é que ele devolva o caminho do arquivo, o nome e o link.

    md-links ./caminho-para-o-arquivo/arquivo.md

<br>

## Sobre as options: `--validate` e `--stats`

Ao passar a opção `--validate`, o módulo, através de uma requisição HTTP verifica se este link é válido e está funcionando:

    md-links ./caminho-do-arquivo/arquivo.md --validate

<br>

Já com a option `--stats` recebemos as estatísticas dos links, ou seja o número de links:

    md-links ./caminho-do-arquivo/arquivo.md --stats

 <br>

E inclusive para obter estatísticas que combinem os resultados de ambas as options `--stats` e `--validate`:
         
      md-links ./caminho-do-arquivo/arquivo.md --stats --validate
   
 <br>
 
 É possivel utiliza-lo para produrar markdowns em diretórios também `--stats` e `--validate`:
         
      md-links ./caminho-do-arquivo/ --stats --validate
   
 <br>

## Testes
     node test