#!/bin/bash
HEADER_START='    <!-- Header -->'
HEADER_END='    </header>'
NEW_HEADER='    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <h2>EasyTech<span class="logo-accent">.services</span></h2>
                </div>
                <ul class="nav-menu">
                    <li><a href="index.html" class="nav-link">Inicio</a></li>
                    <li><a href="servicios.html" class="nav-link">Servicios</a></li>
                    <li><a href="portafolio.html" class="nav-link">Portafolio</a></li>
                    <li><a href="nosotros.html" class="nav-link">Nosotros</a></li>
                    <li><a href="contacto.html" class="nav-link">Contacto</a></li>
                </ul>
                <div class="nav-toggle">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    </header>'

for file in servicios.html contacto.html nosotros.html portafolio.html paquetes-web.html blog.html carreras.html desarrollo-web-panama.html integracion-odoo-crm.html tienda-online-pymes.html; do
    if [ -f "$file" ] && [ "$file" != "index.html" ]; then
        echo "Adaptando $file..."
        # Remover referencias a assets/images/logo.png en favicon
        sed -i 's|<link rel="icon.*assets/images/logo.png.*>||g' "$file"
        sed -i 's|<link rel="apple-touch-icon.*assets/images/logo.png.*>||g' "$file"
        sed -i 's|<link rel="shortcut icon.*assets/images/logo.png.*>||g' "$file"
        # Remover referencias a og-image y twitter-image que no existen
        sed -i 's|<meta property="og:image".*assets/images.*>||g' "$file"
        sed -i 's|<meta property="twitter:image".*assets/images.*>||g' "$file"
        # Remover logo de schema.org
        sed -i 's|"logo": "https://easytech.services/assets/images/logo.png"||g' "$file"
    fi
done
echo "Adaptación completada"
