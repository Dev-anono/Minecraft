# Руководство по модульной структуре

## Текущая структура (проверено ✅)

Все модули корректно разделены и проверены.

### Порядок загрузки (критичен!)

```
1. config.js      → Глобальные переменные (canvas, ctx, MathGlob)
2. textures.js    → Объект textures с генераторами
3. blocks.js      → win, console, worldSeed, Marsaglia, PerlinNoise, OpenSimplex, PVector, settings
4. shapes.js      → Block, Sides, shapes, initShapes(), genIcons()
5. world.js       → Camera class, матрицы, rayTrace, collision, World class
6. renderer.js    → getShadows, аналитика, defineWorld()
7. player.js      → controls() - WASD управление
8. ui.js          → Slider, Button классы, initButtons(), initTextures(), HUD
9. webgl.js       → use2d(), use3d(), initWebgl(), initBackgrounds()
10. game.js       → initPlayer(), initWorldsMenu(), initEverything(), gameLoop()
11. main.js       → Entry point, вызывает MineKhan()
```

### Описание модулей

#### config.js (16 строк)
- DOM элементы (canvas, ctx, savebox, etc.)
- Глобальная переменная MathGlob

#### textures.js (415 строк)
- Процедурные генераторы текстур (grassTop, grassSide, leaves, etc.)
- Закодированные строки текстур для 60+ блоков
- Функции setPixel, getPixels

#### blocks.js (661 строка)
- Window/console ссылки
- Seed хеширование
- Marsaglia PRNG
- Perlin Noise
- OpenSimplex Noise
- PVector класс
- Настройки (sky, superflat, trees, caves)
- Block константы
- inventory объект
- Pointer lock функции

#### shapes.js (669 строк)
- Block битмаски (top, bottom, north, south, east, west)
- Sides индексы
- shapes объект (cube, slab, stair, stairsSlab, slabStairs)
- compareArr(), initShapes(), genIcons()

#### world.js (919 строк)
- Camera класс (позиция, вращение, FOV, проекция)
- Математика матриц (trans, rotX, rotY, transpose, matMult, FOV)
- rayTrace() - DDA ray casting
- collided() - AABB коллизии
- World класс (чанки, генерация, сериализация)

#### renderer.js (1235 строк)
- getShadows - ambient occlusion
- interpolateShadows()
- chunkDist(), sortChunks()
- defineWorld() - tick + render
- Аналитика кадров

#### player.js (61 строка)
- controls() - обработка WASD, sprint, fly
- Расчёт скорости и движения

#### ui.js (910 строк)
- Slider класс
- Button класс
- initButtons() - все кнопки для всех экранов
- initTextures() - генерация текстурного атласа
- drawIcon(), hotbar(), hud(), drawInv()
- Обработчики мыши

#### webgl.js (213 строк)
- use2d(), use3d() - переключение шейдеров
- startLoad()
- initWebgl() - WebGL контекст, компиляция шейдеров
- initBackgrounds() - генерация фона

#### game.js (333 строки)
- initPlayer() - создание камеры, позиция
- initWorldsMenu() - заполнение UI миров
- initEverything() - полная инициализация
- drawScreens.* - функции отрисовки экранов
- gameLoop() - основной цикл
- return gameLoop

#### main.js (20 строк)
- DOMContentLoaded listener
- Вызов MineKhan()
- Отмена предыдущего raf
- Запуск игры

## Автоматическое разделение

Если нужно переразделить:

```bash
./split-modules.sh
```

## Откат к одному файлу

В `index.html` закомментируйте все модули и раскомментируйте:
```html
<script src="js/minecraft-full.js"></script>
```

## Тестирование

```bash
python -m http.server 8000
# Откройте: http://localhost:8000
```
