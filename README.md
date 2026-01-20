# Dispatcher RZA (RZA Dispatcher)

Prototype learning game UI for relay protection & automation training.

## Run locally (подробная инструкция)

### Вариант A — через Python (рекомендуется)
1. Перейдите в корень репозитория:
   ```bash
   cd /workspace/gamerza
   ```
2. Запустите статический сервер:
   ```bash
   python3 -m http.server --directory src 8000
   ```
3. Откройте в браузере:
   ```
   http://localhost:8000
   ```

### Вариант B — через Node.js (если нет Python)
1. Установите `http-server`:
   ```bash
   npm install -g http-server
   ```
2. Запустите сервер из корня репозитория:
   ```bash
   http-server src -p 8000
   ```
3. Откройте в браузере:
   ```
   http://localhost:8000
   ```

### Возможные проблемы
- Если страница открывается, но миссии/модули не отображаются, вы открыли файл напрямую.
  Нужно запустить сервер из инструкций выше, иначе браузер блокирует загрузку JSON.
- Если порт 8000 занят, выберите другой (например 8080) и откройте соответствующий адрес.

## Data-driven content
Mission, module, and glossary content is stored in `data/*.json` and rendered on the client.
