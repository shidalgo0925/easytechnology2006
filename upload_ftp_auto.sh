#!/bin/bash
# Script automático para subir archivos por FTP
# IMPORTANTE: Necesitas proporcionar la contraseña FTP

FTP_SERVER="ftp.easytech.services"
FTP_USER="9542cf8f@easytech.services"
FTP_PORT="21"
REMOTE_DIR="public_html"
LOCAL_DIR="/home/relaticpanama2025/.shh/easytech-prod"

echo "🚀 Preparando subida de archivos a Namecheap..."
echo ""
echo "Servidor: $FTP_SERVER"
echo "Usuario: $FTP_USER"
echo "Directorio local: $LOCAL_DIR"
echo "Directorio remoto: $REMOTE_DIR"
echo ""

# Verificar lftp
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp no está instalado"
    echo "Instalando lftp..."
    sudo apt-get update && sudo apt-get install -y lftp
fi

echo "✅ lftp disponible"
echo ""
echo "📋 Para ejecutar la subida, usa uno de estos métodos:"
echo ""
echo "MÉTODO A - Con contraseña en comando (menos seguro):"
echo "  lftp -u $FTP_USER,PASSWORD -p $FTP_PORT $FTP_SERVER -e \"cd $REMOTE_DIR; mirror -R --exclude-glob='*.backup*' --exclude-glob='*.md' --exclude-glob='.git*' --exclude-glob='build.py' --exclude-glob='ANALISIS_*' --exclude-glob='VERIFICACION_*' $LOCAL_DIR .; quit\""
echo ""
echo "MÉTODO B - Interactivo (más seguro):"
echo "  lftp -u $FTP_USER -p $FTP_PORT $FTP_SERVER"
echo "  (luego dentro de lftp:)"
echo "  cd $REMOTE_DIR"
echo "  mirror -R --exclude-glob='*.backup*' --exclude-glob='*.md' --exclude-glob='.git*' --exclude-glob='build.py' --exclude-glob='ANALISIS_*' --exclude-glob='VERIFICACION_*' $LOCAL_DIR ."
echo "  quit"
echo ""
echo "MÉTODO C - Usando archivo de configuración:"
echo "  Crear ~/.lftprc con:"
echo "    set ftp:ssl-force true"
echo "    set ftp:ssl-protect-data true"
echo "  Luego: lftp -u $FTP_USER -p $FTP_PORT $FTP_SERVER"
