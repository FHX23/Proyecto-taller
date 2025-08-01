# Contenido para tu archivo /home/ubuntu/Proyecto-taller/frontend/Dockerfile

# Etapa 1: Build - Construye la aplicación de frontend
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
# Se usa npm install en vez de ci por si hay que actualizar paquetes menores
RUN npm install

COPY . .

# La clave: se usa una ruta relativa para que el navegador sepa a dónde apuntar
# sin importar la IP del servidor. Apuntará a /api en el mismo dominio.
RUN echo "VITE_BASE_URL=/api" > .env

RUN npm run build

# Etapa 2: Serve - Sirve los archivos estáticos con un Nginx optimizado
FROM nginx:stable-alpine

# Copia los archivos de la aplicación construidos en la etapa anterior
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx para manejar el proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx se inicia automáticamente por el comando por defecto de la imagen base