#!/usr/bin/env bash
# Деплой на прод: git pull → сборка → миграции → перезапуск PM2.
# Запускать на сервере из корня проекта: bash scripts/deploy.sh

set -euo pipefail

load_node_env() {
  export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

  for profile in "$HOME/.profile" "$HOME/.bash_profile"; do
    if [[ -s "$profile" ]]; then
      # shellcheck disable=SC1090
      source "$profile" 2>/dev/null || true
    fi
  done

  if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    # shellcheck disable=SC1091
    source "$HOME/.nvm/nvm.sh"
  fi

  if [[ -s "$HOME/.bashrc" ]]; then
    # shellcheck disable=SC1091
    source "$HOME/.bashrc" 2>/dev/null || true
  fi

  for bin_dir in /opt/nodejs/*/bin "$HOME/.fnm/current/bin"; do
    if [[ -d "$bin_dir" ]]; then
      PATH="$bin_dir:$PATH"
    fi
  done
  export PATH

  if [[ -n "${NODE_BIN_DIR:-}" && -d "$NODE_BIN_DIR" ]]; then
    PATH="$NODE_BIN_DIR:$PATH"
    export PATH
  fi
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Ошибка: команда '$1' не найдена в PATH=$PATH"
    exit 1
  fi
}

load_node_env
require_command node
require_command npm
require_command pm2

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PM2_APP_NAME="${PM2_APP_NAME:-lenetl}"
BRANCH="${DEPLOY_BRANCH:-master}"

cd "$APP_DIR"

echo "==> Деплой в $APP_DIR (ветка $BRANCH)"
echo "==> node $(node -v), npm $(npm -v)"

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
