#!/usr/bin/env python3
"""
Build script para compilar templates HTML siguiendo mejores prácticas de Python.
Similar a Django/Flask, compila templates base con componentes reutilizables.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / 'templates'
COMPONENTS_DIR = TEMPLATES_DIR / 'components'
PAGES_DIR = TEMPLATES_DIR / 'pages'
OUTPUT_DIR = BASE_DIR

def read_file(filepath):
    """Lee un archivo y retorna su contenido."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Escribe contenido a un archivo."""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def include_component(content, components_dir):
    """Reemplaza {% include 'component.html' %} con el contenido del componente."""
    pattern = r"{%\s*include\s*['\"]([^'\"]+)['\"]\s*%}"
    
    def replace_include(match):
        component_path = match.group(1)
        # Buscar en components/ (puede ser 'components/header.html' o 'header.html')
        if '/' in component_path:
            component_file = components_dir.parent / component_path
        else:
            component_file = components_dir / component_path
        
        if component_file.exists():
            return read_file(component_file)
        # Si no existe, intentar solo el nombre del archivo
        component_file = components_dir / Path(component_path).name
        if component_file.exists():
            return read_file(component_file)
        print(f"⚠️  Advertencia: Componente no encontrado: {component_path}")
        return match.group(0)  # Si no existe, dejar como está
    
    return re.sub(pattern, replace_include, content)

def process_blocks(base_content, page_content):
    """Procesa los bloques {% block name %}...{% endblock %}."""
    # Extraer bloques de la página
    block_pattern = r"{%\s*block\s+(\w+)\s*%}(.*?){%\s*endblock\s*%}"
    page_blocks = {}
    
    for match in re.finditer(block_pattern, page_content, re.DOTALL):
        block_name = match.group(1)
        block_content = match.group(2).strip()
        page_blocks[block_name] = block_content
    
    # Reemplazar bloques en el base
    def replace_block(match):
        block_name = match.group(1)
        default_content = match.group(2) if match.group(2) else ''
        return page_blocks.get(block_name, default_content).strip()
    
    block_replace_pattern = r"{%\s*block\s+(\w+)\s*%}(.*?){%\s*endblock\s*%}"
    result = re.sub(block_replace_pattern, replace_block, base_content, flags=re.DOTALL)
    
    # Procesar includes después de procesar bloques
    result = include_component(result, COMPONENTS_DIR)
    
    return result

def build_page(page_name):
    """Construye una página desde templates."""
    base_file = TEMPLATES_DIR / 'base.html'
    page_file = PAGES_DIR / f'{page_name}.html'
    
    if not base_file.exists():
        print(f"Error: base.html no encontrado en {base_file}")
        return False
    
    if not page_file.exists():
        print(f"Advertencia: {page_name}.html no encontrado en templates/pages/, usando HTML directo")
        return False
    
    # Leer base y página
    base_content = read_file(base_file)
    page_content = read_file(page_file)
    
    # Procesar includes en page_content primero
    page_content = include_component(page_content, COMPONENTS_DIR)
    
    # Procesar bloques (reemplazar bloques en base con contenido de page)
    final_content = process_blocks(base_content, page_content)
    
    # Procesar includes en el resultado final (después de procesar bloques)
    final_content = include_component(final_content, COMPONENTS_DIR)
    
    # Limpiar bloques vacíos que no se reemplazaron
    final_content = re.sub(r"{%\s*block\s+\w+\s*%}\s*{%\s*endblock\s*%}", '', final_content)
    
    # Limpiar cualquier include que quede sin procesar (por si acaso)
    final_content = re.sub(r"{%\s*include\s*['\"][^'\"]+['\"]\s*%}", '', final_content)
    
    # Escribir archivo final
    output_file = OUTPUT_DIR / f'{page_name}.html'
    write_file(output_file, final_content)
    print(f"✅ Generado: {page_name}.html")
    return True

def build_all():
    """Construye todas las páginas."""
    print("🔨 Iniciando build de templates...")
    
    # Páginas a construir
    pages = [
        'index',
        'servicios',
        'paquetes-web',
        'portafolio',
        'nosotros',
        'contacto',
        'blog',
        'carreras',
        'desarrollo-web-panama',
        'integracion-odoo-crm',
        'tienda-online-pymes'
    ]
    
    built = 0
    for page in pages:
        if build_page(page):
            built += 1
    
    print(f"\n✅ Build completado: {built}/{len(pages)} páginas generadas")
    return built == len(pages)

if __name__ == '__main__':
    build_all()

