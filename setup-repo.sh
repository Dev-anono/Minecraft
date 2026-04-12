#!/bin/bash

# Скрипт для инициализации Git репозитория и первой загрузки в GitHub
# Запускать один раз при настройке проекта

REPO_URL="https://github.com/Dev-anono/Minecraft.git"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Minecraft Web - Initial Setup ===${NC}"

# Проверка наличия git
if ! command -v git &> /dev/null; then
    echo -e "${RED}Ошибка: git не установлен${NC}"
    echo "Установите: pkg install git"
    exit 1
fi

cd /data/data/com.termux/files/home/minecraft-web

# Инициализация репозитория
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Инициализация git репозитория...${NC}"
    git init
    echo -e "${GREEN}✓ Git репозиторий инициализирован${NC}"
else
    echo -e "${YELLOW}Git репозиторий уже существует${NC}"
fi

# Добавление remote
if ! git remote | grep -q origin; then
    echo -e "${YELLOW}Добавление remote репозитория...${NC}"
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✓ Remote добавлен: $REPO_URL${NC}"
else
    echo -e "${YELLOW}Remote уже существует${NC}"
fi

# Добавление всех файлов
echo -e "${YELLOW}Добавление файлов...${NC}"
git add .

# Первый коммит
echo -e "${YELLOW}Создание первого коммита...${NC}"
git commit -m "Initial commit - Minecraft Web (MineKhan)"

# Push
echo ""
echo -e "${YELLOW}Загрузка в GitHub...${NC}"
echo -e "${BLUE}Примечание: Может потребоваться авторизация через GitHub token${NC}"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Успешно загружено в GitHub!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "URL репозитория: $REPO_URL"
    echo ""
    echo -e "${YELLOW}Для включения GitHub Pages:${NC}"
    echo "1. Перейдите в настройки репозитория"
    echo "2. Settings → Pages"
    echo "3. Source: main branch, / (root) folder"
    echo "4. Save"
else
    echo ""
    echo -e "${RED}Ошибка при push${NC}"
    echo ""
    echo -e "${YELLOW}Возможные решения:${NC}"
    echo ""
    echo "1. Использовать GitHub Personal Access Token:"
    echo "   git remote set-url origin https://<TOKEN>@github.com/Dev-anono/Minecraft.git"
    echo ""
    echo "2. Использовать SSH вместо HTTPS:"
    echo "   git remote set-url origin git@github.com:Dev-anono/Minecraft.git"
    echo ""
    echo "3. Создать токен на: https://github.com/settings/tokens"
    exit 1
fi
