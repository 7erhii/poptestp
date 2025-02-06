#!/bin/bash
set -e

# Переходим в директорию, где находится скрипт (корень проекта)
cd "$(dirname "$0")"

echo "Остановка текущего процесса PM2 (если существует)..."
pm2 delete poptestp || echo "Процесс poptestp не найден"

echo "Установка зависимостей..."
npm install

echo "Сборка проекта..."
npm run build

echo "Запуск проекта с PM2 на порту 7111..."
PORT=7111 pm2 start npm --name "poptestp" -- start

echo "Деплой завершён!"
