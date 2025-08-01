# Contenido para tu archivo /home/ubuntu/Proyecto-taller/backend/Dockerfile

FROM node:22-alpine

WORKDIR /app

# Usamos 'npm ci' que es más rápido y seguro para entornos de producción
COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

# Buenas prácticas: crear un usuario no-root para correr la aplicación
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# El puerto que la app usa DENTRO del contenedor
EXPOSE 80

CMD ["npm", "start"]