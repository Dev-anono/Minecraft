#!/bin/bash

# Скрипт для автоматического разделения minecraft-full.js на модули

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Разделение Minecraft JS на модули ===${NC}"

cd /data/data/com.termux/files/home/minecraft-web/js

# Проверка наличия файла
if [ ! -f "minecraft-full.js" ]; then
    echo -e "${RED}Ошибка: minecraft-full.js не найден${NC}"
    exit 1
fi

echo -e "${YELLOW}Разделение кода...${NC}"

# 1. config.js (уже есть, пропускаем)
echo -e "  ✓ config.js - уже создан"

# 2. textures.js
sed -n '18,467p' minecraft-full.js > textures_new.js
if [ -s "textures_new.js" ]; then
    mv textures_new.js textures.js
    echo -e "  ✓ textures.js - $(wc -l < textures.js) строк"
else
    echo -e "  ${RED}✗ textures.js - ошибка${NC}"
fi

# 3. blocks.js
sed -n '468,1342p' minecraft-full.js > blocks.js
echo -e "  ✓ blocks.js - $(wc -l < blocks.js) строк"

# 4. world.js
sed -n '1343,4096p' minecraft-full.js > world.js
echo -e "  ✓ world.js - $(wc -l < world.js) строк"

# 5. player.js
sed -n '4097,4164p' minecraft-full.js > player.js
echo -e "  ✓ player.js - $(wc -l < player.js) строк"

# 6. ui.js
sed -n '4165,5084p' minecraft-full.js > ui.js
echo -e "  ✓ ui.js - $(wc -l < ui.js) строк"

# 7. renderer.js
sed -n '5085,5293p' minecraft-full.js > renderer.js
echo -e "  ✓ renderer.js - $(wc -l < renderer.js) строк"

# 8. game.js
sed -n '5294,5425p' minecraft-full.js > game.js
echo -e "  ✓ game.js - $(wc -l < game.js) строк"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Модули успешно созданы!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Следующие шаги:${NC}"
echo "1. Отредактируйте index.html - раскомментируйте модули"
echo "2. Протестируйте: python -m http.server 8000"
echo "3. Задеплойте: ./deploy.sh 'Refactor to modules'"
