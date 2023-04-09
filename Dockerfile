# образ для development
FROM node:alpine

# Создать директорию внутри контейнера
WORKDIR ./app

# Установить зависимости
COPY package*.json ./
RUN npm i -g @nestjs/cli
RUN npm install
RUN npm install --save @nestjs/typeorm typeorm

# Скопировать приложение из текущей директории в WORKDIR-директорию
COPY . .


# Скомпилировать при
#RUN npm run start:dev
CMD ["npm", "run",  "migration:up"]
