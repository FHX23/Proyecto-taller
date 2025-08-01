#!/bin/bash

set -e

echo "🚀 Iniciando despliegue del proyecto QR..."

# --- Sección de Instalación (sin cambios) ---
echo "-> Actualizando paquetes del sistema..."
sudo apt-get update -y > /dev/null

echo "-> Instalando dependencias necesarias..."
sudo apt-get install -y git curl > /dev/null

if ! command -v docker &> /dev/null; then
    echo "Docker no encontrado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "⚠️ Re-loguéate o ejecuta 'newgrp docker' para aplicar permisos."
else
    echo "Docker ya está instalado."
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose no encontrado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose ya está instalado."
fi

# --- Sección de Git (sin cambios) ---
echo "-> Actualizando desde Git..."
git pull

# --- Sección de Creación del .env (ACTUALIZADA) ---
if [ ! -f ".env" ]; then
    echo "-> No se encontró el archivo .env. Por favor, créalo ahora."
    touch .env
    
    echo "Introduce el usuario de la base de datos (POSTGRES_USER):"
    read POSTGRES_USER_VAL
    
    echo "Introduce la contraseña de la base de datos (POSTGRES_PASSWORD):"
    read -s POSTGRES_PASSWORD_VAL
    echo "" # Nueva línea para que el siguiente prompt no se pegue

    echo "Introduce el nombre de la base de datos (POSTGRES_DB):"
    read POSTGRES_DB_VAL
    
    echo "Introduce el secreto para el token de acceso (ACCESS_TOKEN_SECRET):"
    read ACCESS_TOKEN_SECRET_VAL
    
    echo "Introduce la llave para las cookies (cookieKey):"
    read cookieKey_VAL

    # Escribimos las variables con los nombres correctos en el .env
    cat > .env << EOL
# Credenciales de la Base de Datos
POSTGRES_USER=${POSTGRES_USER_VAL}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD_VAL}
POSTGRES_DB=${POSTGRES_DB_VAL}

# Secretos del Backend
ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET_VAL}
cookieKey=${cookieKey_VAL}
EOL

    echo "-> Archivo .env creado correctamente."
else
    echo "-> El archivo .env ya existe. Saltando creación."
fi

echo "-> Deteniendo contenedores antiguos (si existen)..."
# Usamos `|| true` para que no falle si no hay nada que detener
docker-compose down -v || true

echo "-> Levantando contenedores con Docker Compose..."
# El comando 'newgrp' es para aplicar el grupo 'docker' sin re-loguear.
# Si ya estás en una sesión nueva, puedes usar directamente 'docker-compose up --build -d'
newgrp docker <<EOCMD
docker-compose up --build -d
EOCMD

echo "✅ ¡Despliegue completado!"
echo "   📦 Frontend: http://localhost:3000"
echo "   🧠 Backend (API): http://localhost/api/..."
echo "   🐘 Base de datos: localhost:5432"
