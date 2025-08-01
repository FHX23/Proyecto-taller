# ---- Etapa 1: Build (Construcción) ----
# Usamos una imagen de Node para construir el proyecto
FROM node:22-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias e instalamos
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente del frontend
COPY . .

# --- ¡LA PARTE MÁS IMPORTANTE! ---
# Aquí creamos un archivo .env DENTRO del contenedor, justo antes de construir.
# Vite leerá este archivo y configurará la URL base de la API.
RUN echo "VITE_BASE_URL=/api" > .env

# Ahora, construimos el proyecto. Vite usará la variable anterior.
RUN npm run build

# ---- Etapa 2: Serve (Servir) ----
# Usamos una imagen súper ligera de Nginx para servir los archivos
FROM nginx:stable-alpine

# Copiamos los archivos estáticos generados en la etapa de build
# desde la carpeta /usr/src/app/dist del constructor
# hacia la carpeta web de Nginx.
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copiamos nuestro archivo de configuración de Nginx que maneja el /api
# Asegúrate de que este archivo (nginx.conf) exista en tu carpeta 'frontend'
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80, que es el que usa Nginx
EXPOSE 80

# Nginx se inicia automáticamente, no se necesita un CMD.
