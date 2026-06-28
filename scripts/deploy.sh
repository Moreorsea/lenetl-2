#!/usr/bin/env bash
# Деплой на прод: git pull → сборка → миграции → перезапуск PM2.
# Запускать на сервере из корня проекта: bash scripts/deploy.sh

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PM2_APP_NAME="${PM2_APP_NAME:-lenetl}"
BRANCH="${DEPLOY_BRANCH:-master}"

cd "$APP_DIR"

echo "==> Деплой в $APP_DIR (ветка $BRANCH)"

if [[ ! -f .env ]]; then
  echo "Ошибка: нет файла .env в $APP_DIR"
  exit 1
fi

echo "==> git pull"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "==> npm ci"
npm ci

echo "==> сборка"
npm run build

echo "==> зависимости Nitro (.output/server)"
cd .output/server
npm ci --omit=dev 2>/dev/null || npm install --omit=dev
cd "$APP_DIR"

echo "==> миграции Prisma"
npm run db:deploy

echo "==> перезапуск PM2"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 restart ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

echo "==> Готово"
pm2 status "$PM2_APP_NAME"
