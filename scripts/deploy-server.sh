#!/usr/bin/env bash
# Лёгкий деплой на сервере: распаковать deploy.tar.gz и перезапустить PM2.
# Сборка выполняется в GitHub Actions (на сервере не хватает RAM для npm ci).

set -euo pipefail

load_node_env() {
  export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  [ -s "$HOME/.bashrc" ] && . "$HOME/.bashrc" 2>/dev/null || true
}

load_node_env

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PM2_APP_NAME="${PM2_APP_NAME:-lenetl}"

cd "$APP_DIR"

if [[ ! -f deploy.tar.gz ]]; then
  echo "Ошибка: нет deploy.tar.gz в $APP_DIR"
  exit 1
fi

echo "==> остановка PM2"
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true

echo "==> распаковка .output"
rm -rf .output
tar -xzf deploy.tar.gz
rm -f deploy.tar.gz

echo "==> перезапуск PM2"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 restart ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

pm2 status "$PM2_APP_NAME"
echo "==> Готово"
