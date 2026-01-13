#!/bin/bash
# Script para subir todos los archivos a Namecheap

FTP_USER="9542cf8f@easytech.services"
FTP_PASS="Mariachi@0925"
FTP_SERVER="ftp.easytech.services"
FTP_PORT="21"
LOCAL_DIR="/home/relaticpanama2025/.shh/easytech-prod"
REMOTE_DIR="public_html"

echo "🚀 Iniciando subida completa de archivos..."
echo ""

cd "$LOCAL_DIR"

# Crear script de lftp
cat > /tmp/lftp_upload.lftp << EOF
set ftp:ssl-allow yes
set ssl:verify-certificate no
set ftp:passive-mode yes
open -u $FTP_USER,$FTP_PASS -p $FTP_PORT $FTP_SERVER
cd $REMOTE_DIR

# Subir archivos principales
put styles.css
put script.js
put service-worker.js
put manifest.json
put sitemap.xml
put robots.txt

# Subir archivos HTML
put index.html
put servicios.html
put contacto.html
put nosotros.html
put portafolio.html
put blog.html
put carreras.html
put desarrollo-web-panama.html
put integracion-odoo-crm.html
put tienda-online-pymes.html
put paquetes-web.html
put club-vip-detail.html
put odoo18-detail.html
put whatsapp-services-detail.html

# Subir carpeta assets
mirror -R --parallel=3 assets/ assets/

# Verificar
echo "=== VERIFICACIÓN ==="
ls -lh index.html styles.css script.js 2>/dev/null
echo ""
echo "Total HTML:"
ls -1 *.html 2>/dev/null | wc -l

quit
EOF

# Ejecutar lftp
lftp -f /tmp/lftp_upload.lftp

echo ""
echo "✅ Subida completada"



