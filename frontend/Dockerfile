# Etapa 1: Build
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "VITE_BASE_URL=http://localhost/api" > .env
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
