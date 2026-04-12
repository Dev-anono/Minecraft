# Minecraft Web (MineKhan)

Клон Minecraft на чистом JavaScript с WebGL рендерингом, работающий в браузере.

## 🚀 Демо

[Открыть игру](https://dev-anono.github.io/Minecraft/)

## 📁 Структура проекта

```
minecraft-web/
├── index.html              # Главная страница + шейдеры
├── css/
│   └── styles.css          # Стили (96 строк)
├── js/
│   ├── config.js           # Глобальные переменные (16 строк)
│   ├── textures.js         # Генераторы текстур (415 строк)
│   ├── blocks.js           # Noise, PRNG, блоки (661 строка)
│   ├── shapes.js           # Формы блоков (669 строк)
│   ├── world.js            # Camera, World классы (919 строк)
│   ├── renderer.js         # Тени, рендеринг чанков (1235 строк)
│   ├── player.js           # Управление игроком (61 строка)
│   ├── ui.js               # Slider, Button, HUD (910 строк)
│   ├── webgl.js            # WebGL инициализация (213 строк)
│   ├── game.js             # Игровой цикл (333 строки)
│   ├── main.js             # Точка входа (20 строк)
│   └── minecraft-full.js   # Полный оригинальный файл (5426 строк)
├── deploy.sh               # Скрипт деплоя в GitHub
├── setup-repo.sh           # Инициализация репозитория
├── split-modules.sh        # Скрипт разделения на модули
├── MODULARIZE.md           # Инструкция по модуляризации
├── README.md               # Документация
└── .gitignore              # Исключения Git
```

## 🎮 Управление

- **WASD** - Движение
- **Мышь** - Обзор
- **ЛКМ** - Разрушить блок
- **ПКМ** - Поставить блок
- **Пробел** - Прыжок
- **1-9** - Выбор слота в хотбаре
- **E** - Инвентарь
- **Esc** - Пауза

## 🛠 Деплой

### GitHub Pages

1. Загрузите код в репозиторий:
   ```bash
   chmod +x setup-repo.sh
   ./setup-repo.sh
   ```

2. Включите GitHub Pages в настройках репозитория:
   - Settings → Pages → Source: `main` branch, `/ (root)` folder

### Локальный запуск

Просто откройте `index.html` в браузере или используйте локальный сервер:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

## 📋 Возможности

- ✅ Процедурная генерация мира (Perlin/Simplex noise)
- ✅ Различные биомы и структуры
- ✅ Система крафта
- ✅ Инвентарь
- ✅ Сохранение/загрузка миров
- ✅ Динамическое освещение и тени
- ✅ Туман
- ✅ Несколько типов блоков
- ✅ Деревья и пещеры

## 🔧 Технологии

- Vanilla JavaScript (ES6+)
- WebGL для 3D рендеринга
- GLSL шейдеры
- Canvas 2D для UI
- Procedural texture generation

## 📊 Статистика модулей

| Модуль | Строк | Описание |
|--------|-------|----------|
| config.js | 16 | Глобальные переменные |
| textures.js | 415 | Процедурные текстуры блоков |
| blocks.js | 661 | Шум, PRNG, константы блоков |
| shapes.js | 669 | Геометрия блоков |
| world.js | 919 | Камера, матрицы, World класс |
| renderer.js | 1235 | Тени, отрисовка чанков |
| player.js | 61 | WASD управление |
| ui.js | 910 | Кнопки, слайдеры, HUD |
| webgl.js | 213 | WebGL контекст, шейдеры |
| game.js | 333 | Игровой цикл, инициализация |
| main.js | 20 | Entry point |

**Всего:** ~5426 строк кода в 11 модулях

## 📝 Лицензия

Оригинальный проект MineKhan. Образовательный проект.

## 🤝 Контрибуция

1. Fork репозиторий
2. Создайте ветку для фичи (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request
