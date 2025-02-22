#!/bin/bash
echo "Iniciando o deploy da aplicação..."

cd /home/u657600000/domains/bade.digital/public_html/laurus-api

# Instalar dependências
npm install

# Rodar as migrations do Prisma (caso esteja usando)
npx prisma migrate deploy
npx prisma generate

# Construir a aplicação (caso use TypeScript ou outro build)
npm run build

echo "Deploy concluído com sucesso!"
