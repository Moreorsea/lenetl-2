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
SERVER_DIR="$APP_DIR/.output/server"
if [[ -f "$SERVER_DIR/package.json" ]]; then
  cd "$SERVER_DIR"
  rm -rf node_modules package-lock.json

  node <<'NODE'
const fs = require('fs');
const path = 'package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
for (const section of ['dependencies', 'optionalDependencies', 'devDependencies']) {
  if (!pkg[section]) continue;
  for (const name of Object.keys(pkg[section])) {
    if (/musl/i.test(name)) delete pkg[section][name];
  }
}
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
NODE

  if ! npm install --omit=dev --no-package-lock --os=linux --libc=glibc; then
    echo "==> fallback: копируем зависимости из корневого node_modules"
    mkdir -p node_modules
    ROOT_DIR="$APP_DIR" node <<'NODE'
const fs = require('fs');
const path = require('path');
const root = process.env.ROOT_DIR;
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = Object.keys(pkg.dependencies || {}).filter((name) => !/musl/i.test(name));
for (const name of deps) {
  const src = path.join(root, 'node_modules', name);
  const dest = path.join('node_modules', name);
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, dest, { recursive: true, force: true });
}
NODE
  fi
  cd "$APP_DIR"
else
  echo "==> package.json в .output/server не найден, пропускаем"
fi

echo "==> миграции Prisma"
set +e
MIGRATE_OUTPUT="$(npm run db:deploy 2>&1)"
MIGRATE_EXIT=$?
set -e
echo "$MIGRATE_OUTPUT"

if [[ $MIGRATE_EXIT -ne 0 ]]; then
  if echo "$MIGRATE_OUTPUT" | grep -q "P3005"; then
    echo "==> P3005: БД уже существует без истории миграций."
    echo "==> Один раз выполните baseline (см. инструкцию), затем migrate deploy будет работать."
    echo "==> Продолжаем деплой без миграций."
  else
    echo "Ошибка: migrate deploy завершился с кодом $MIGRATE_EXIT"
    exit 1
  fi
fi

echo "==> перезапуск PM2"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 restart ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

echo "==> Готово"
pm2 status "$PM2_APP_NAME"
