#!/bin/bash

# Скрипт для загрузки изменений в GitHub репозиторий
# Usage: ./deploy.sh [commit_message]

REPO_URL="https://github.com/Dev-anono/Minecraft.git"
COMMIT_MESSAGE="${1:-Update Minecraft web version}"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Minecraft Web - Deploy to GitHub ===${NC}"

# Проверка наличия git
if ! command -v git &> /dev/null; then
    echo -e "${RED}Ошибка: git не установлен${NC}"
    exit 1
fi

# Инициализация репозитория (если нужно)
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Инициализация git репозитория...${NC}"
    git init
    git remote add origin "$REPO_URL" 2>/dev/null || echo "Remote already exists"
fi

# Добавление изменений
echo -e "${YELLOW}Добавление изменений...${NC}"
git add .

# Проверка наличия изменений
if git diff --staged --quiet; then
    echo -e "${YELLOW}Нет изменений для коммита${NC}"
    exit 0
fi

# Коммит
echo -e "${YELLOW}Создание коммита...${NC}"
git commit -m "$COMMIT_MESSAGE"

# Push
echo -e "${YELLOW}Загрузка в GitHub...${NC}"
git push -u origin main || git push -u origin master

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Успешно загружено в $REPO_URL${NC}"
else
    echo -e "${RED}Ошибка при push. Возможно, нужна авторизация.${NC}"
    echo -e "${YELLOW}Попробуйте: git push -u origin main --force${NC}"
    exit 1
fi
