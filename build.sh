#!/bin/bash

# Сборка модулей в рабочий minecraft-full.js
# Запускать после изменений в любом модуле

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Сборка Minecraft из модулей ===${NC}"

cd /data/data/com.termux/files/home/minecraft-web/js

# Очищаем старый файл
> minecraft-full.js

# Список модулей (порядок важен!)
MODULES=(
	"textures.js"
	"blocks.js"
	"shapes.js"
	"world.js"
	"renderer.js"
	"player.js"
	"ui.js"
	"webgl.js"
	"game.js"
)

# Добавляем каждый модуль
for mod in "${MODULES[@]}"; do
	if [ -f "$mod" ]; then
		cat "$mod" >> minecraft-full.js
		echo "" >> minecraft-full.js
		echo -e "  ${GREEN}✓$mod${NC}"
	else
		echo -e "  ${RED}✗$mod - НЕ НАЙДЕН${NC}"
		exit 1
	fi
done

# Конец файла - закрываем MineKhan и запускаем
cat >> minecraft-full.js << 'FOOTER'

init = MineKhan()
if (window.parent.raf) {
	window.cancelAnimationFrame(window.parent.raf)
	console.log("Canceled", window.parent.raf)
}
init()
FOOTER

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Сборка завершена!${NC}"
echo -e "${GREEN}========================================${NC}"

lines=$(wc -l < minecraft-full.js)
echo "minecraft-full.js: $lines строк"
echo ""
echo -e "${YELLOW}Для деплоя:${NC} ./deploy.sh 'Rebuild from modules'"
