#!/bin/bash

# Script para remover componentes não utilizados

# Lista de componentes a manter
KEEP_COMPONENTS=(
  "button.tsx"
  "input.tsx"
  "card.tsx"
  "separator.tsx"
  "avatar.tsx"
  "toast.tsx"
  "toaster.tsx"
  "use-toast.ts"
)

# Diretório dos componentes
COMPONENTS_DIR="components/ui"

# Verificar se o diretório existe
if [ ! -d "$COMPONENTS_DIR" ]; then
  echo "Diretório $COMPONENTS_DIR não encontrado!"
  exit 1
fi

# Contar componentes antes da limpeza
BEFORE_COUNT=$(ls -1 "$COMPONENTS_DIR" | wc -l)
echo "Componentes antes da limpeza: $BEFORE_COUNT"

# Remover componentes não utilizados
for file in "$COMPONENTS_DIR"/*.tsx "$COMPONENTS_DIR"/*.ts; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    keep=false
    
    for keep_file in "${KEEP_COMPONENTS[@]}"; do
      if [ "$filename" == "$keep_file" ]; then
        keep=true
        break
      fi
    done
    
    if [ "$keep" = false ]; then
      echo "Removendo $filename"
      rm "$file"
    else
      echo "Mantendo $filename"
    fi
  fi
done

# Contar componentes após a limpeza
AFTER_COUNT=$(ls -1 "$COMPONENTS_DIR" | wc -l)
echo "Componentes após a limpeza: $AFTER_COUNT"
echo "Removidos: $(($BEFORE_COUNT - $AFTER_COUNT)) componentes"
