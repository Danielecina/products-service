# Usa un'immagine di Node.js
FROM node:23.11.0-alpine

# Imposta la cartella di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia i file del progetto dentro la cartella di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il codice nell'immagine
COPY . .

# Compila il progetto NestJS (se hai il supporto per la build)
RUN npm run build

# Espone la porta 3000
EXPOSE 3000

# Avvia l'applicazione NestJS
CMD ["npm", "run", "start"]
