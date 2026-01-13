#!/bin/bash
# Script para subir archivos de easytech-prod a Namecheap por FTP
# Uso: ./upload_ftp.sh

FTP_SERVER="ftp.easytech.services"
FTP_USER="9542cf8f@easytech.services"
FTP_PORT="21"
REMOTE_DIR="/public_html"  # Directorio típico en Namecheap

echo "🚀 Iniciando subida de archivos a Namecheap..."
echo ""
echo "Servidor: $FTP_SERVER"
echo "Usuario: $FTP_USER"
echo "Puerto: $FTP_PORT"
echo "Directorio remoto: $REMOTE_DIR"
echo ""

# Verificar si lftp está instalado (mejor para FTPS)
if command -v lftp &> /dev/null; then
    echo "✅ lftp encontrado (recomendado para FTPS)"
    echo ""
    echo "Ejecuta manualmente:"
    echo "lftp -u $FTP_USER -p $FTP_PORT $FTP_SERVER"
    echo ""
    echo "Luego dentro de lftp:"
    echo "  cd $REMOTE_DIR"
    echo "  mirror -R --exclude-glob='*.backup*' --exclude-glob='*.md' --exclude-glob='.git*' ."
    echo "  quit"
elif command -v ftp &> /dev/null; then
    echo "⚠️  ftp encontrado (básico, no soporta FTPS explícito)"
    echo "Recomendado usar lftp para FTPS"
else
    echo "❌ No se encontró cliente FTP instalado"
    echo "Instala lftp: sudo apt-get install lftp"
fi

echo ""
echo "📝 Archivos a subir:"
echo "  - Todos los .html, .css, .js, .json, .xml, .txt"
echo "  - Carpeta assets/ completa"
echo "  - Carpeta templates/ (si es necesario)"
echo ""
echo "⚠️  Archivos a EXCLUIR:"
echo "  - *.backup*"
echo "  - *.md (documentación)"
echo "  - .git/ (control de versiones)"
echo "  - build.py (solo para desarrollo local)"
