#!/bin/bash

set -e

echo "🚀 Iniciando despliegue del proyecto QR..."

echo "-> Actualizando paquetes del sistema..."
sudo apt-get update -y

echo "-> Instalando Git, Docker y Docker Compose..."
sudo apt-get install -y git curl

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
    sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose ya está instalado."
fi

REPO_URL=\"https://github.com/FHX23/Proyecto-taller.git\"
PROJECT_DIR=\"Taller-desarollo\"

echo \"-> Actualizando desde Git...\"
git pull

if [ ! -f \".env\" ]; then
    echo \"-> No se encontró el archivo .env. Por favor, créalo ahora.\"
    touch .env
    echo \"Introduce el valor para DB_USERNAME:\"
    read DB_USERNAME_VAL
    echo \"Introduce el valor para PASSWORD:\"
    read -s PASSWORD_VAL
    echo \"Introduce el valor para DATABASE:\"
    read DATABASE_VAL
    echo \"Introduce el valor para ACCESS_TOKEN_SECRET:\"
    read ACCESS_TOKEN_SECRET_VAL
    echo \"Introduce el valor para cookieKey:\"
    read cookieKey_VAL

    cat > .env << EOL
DB_USERNAME=${DB_USERNAME_VAL}
PASSWORD=${PASSWORD_VAL}
DATABASE=${DATABASE_VAL}
ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET_VAL}
cookieKey=${cookieKey_VAL}
EOL

    echo \"-> Archivo .env creado.\"
else
    echo \"-> El archivo .env ya existe. Saltando creación.\"
fi

echo \"-> Levantando contenedores con Docker Compose...\"
newgrp docker <<EOCMD
docker-compose up --build -d
EOCMD

echo \"✅ ¡Despliegue completado!\"
echo \"📦 Frontend: http://localhost:3000\"
echo \"🧠 Backend (API): http://localhost/api/...\"
echo \"🐘 Base de datos: localhost:5432\"
