#!/bin/bash

# Termina el script si algún comando falla
set -e

echo "🚀 Iniciando despliegue del proyecto QR..."

# 1. ACTUALIZAR EL SISTEMA E INSTALAR DEPENDENCIAS
echo "-> Actualizando paquetes del sistema..."
sudo apt-get update -y

echo "-> Instalando Git, Docker y Docker Compose..."
sudo apt-get install -y git curl
# Instalación de Docker
if ! command -v docker &> /dev/null
then
    echo "Docker no encontrado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER # Añadir usuario actual al grupo docker para no usar sudo
    echo "¡Importante! Debes cerrar sesión y volver a entrar para que los cambios de grupo de Docker tengan efecto."
    echo "El script continuará, pero puede que necesites ejecutar 'newgrp docker' o re-loguearte."
else
    echo "Docker ya está instalado."
fi

# Instalación de Docker Compose
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose no encontrado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose ya está instalado."
fi

# 2. CLONAR O ACTUALIZAR EL REPOSITORIO
REPO_URL="https://github.com/FHX23/Proyecto-taller.git"
PROJECT_DIR="Taller-desarollo"

echo "-> Actualizando desde Git..."
git pull

# 3. CONFIGURAR EL ARCHIVO .env
if [ ! -f ".env" ]; then
    echo "-> No se encontró el archivo .env. Por favor, créalo ahora."
    echo "Puedes basarte en el archivo .env.example."
    # Crea un archivo .env vacío para que el usuario lo llene
    touch .env
    echo "Introduce el valor para DB_USERNAME:"
    read DB_USERNAME_VAL
    echo "Introduce el valor para PASSWORD:"
    read -s PASSWORD_VAL # -s para que no se vea la contraseña
    echo "Introduce el valor para DATABASE:"
    read DATABASE_VAL
    echo "Introduce el valor para ACCESS_TOKEN_SECRET:"
    read ACCESS_TOKEN_SECRET_VAL
    echo "Introduce el valor para cookieKey:"
    read cookieKey_VAL

    # Escribiendo al archivo .env
    cat > .env << EOL
DB_USERNAME=${DB_USERNAME_VAL}
PASSWORD=${PASSWORD_VAL}
DATABASE=${DATABASE_VAL}
ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET_VAL}
cookieKey=${cookieKey_VAL}
EOL
    echo "-> Archivo .env creado."
else
    echo "-> El archivo .env ya existe. Saltando creación."
fi

# 4. LEVANTAR LOS CONTENEDORES
echo "-> Construyendo y levantando los contenedores con Docker Compose..."
# El comando newgrp docker es un intento de aplicar el grupo sin re-loguear
newgrp docker <<EOCMD
docker-compose up --build -d
EOCMD

echo "✅ ¡Despliegue completado!"
echo "Tu aplicación debería estar disponible en la IP de tu servidor."
echo "Puedes ver los logs con: docker-compose logs -f"
echo "Para detener todo, usa: docker-compose down"