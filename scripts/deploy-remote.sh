#!/usr/bin/env bash
# Распаковка deploy.tar.gz и перезапуск PM2. Вызывается из GitHub Actions по SSH.

set -euo pipefail

APP_DIR="${1:-.}"
PM2_APP_NAME="${PM2_APP_NAME:-lenetl}"

load_node_env() {
  export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  [ -s "$HOME/.bashrc" ] && . "$HOME/.bashrc" 2>/dev/null || true
}

load_node_env

cd "$APP_DIR"
echo "==> Деплой артефакта в $(pwd)"
ls -la deploy.tar.gz .env ecosystem.config.cjs 2>/dev/null || true

if [[ ! -f deploy.tar.gz ]]; then
  echo "ОШИБКА: deploy.tar.gz не найден в $(pwd)"
  ls -la
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "ОШИБКА: нет файла .env"
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "ОШИБКА: pm2 не найден в PATH=$PATH"
  exit 1
fi

echo "==> node $(node -v 2>/dev/null || echo '?'), pm2 $(pm2 -v 2>/dev/null || echo '?')"

echo "==> остановка PM2"
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true

echo "==> распаковка .output"
rm -rf .output
tar -xzf deploy.tar.gz
rm -f deploy.tar.gz

if [[ ! -f .output/server/index.mjs ]]; then
  echo "ОШИБКА: после распаковки нет .output/server/index.mjs"
  ls -la .output .output/server 2>/dev/null || true
  exit 1
fi

echo "==> перезапуск PM2"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 restart ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

pm2 status "$PM2_APP_NAME"
echo "==> Деплой завершён"
