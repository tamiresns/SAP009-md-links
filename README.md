## lembrar

no package.json tem um nó chamdo "bin".
Para fazer funciona-lo precisei executar um comando na raiz do projeto (via terminal): "npm link" e depois disso o meu alias "md-links" começou a funcionar no terminal (desde que executado na raiz do projeto)

"O comando npm link é usado para criar um link simbólico global para o seu módulo npm. Isso permite que você use o seu módulo como se estivesse instalado globalmente em sua máquina, mesmo que você ainda esteja desenvolvendo-o localmente.

Quando você executa npm link dentro do diretório do seu módulo, ele cria um link simbólico que aponta para o diretório local do seu módulo npm. Em seguida, você pode executar seu módulo usando o nome do bin especificado no package.json, seguido pelos argumentos e flags necessários."
