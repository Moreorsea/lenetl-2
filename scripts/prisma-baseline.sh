#!/usr/bin/env bash
# Однократно: пометить существующие миграции как уже применённые (baseline).
# Запускать на сервере из корня проекта, когда БД создана до prisma migrate.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "==> Baseline Prisma для существующей БД"

npx prisma migrate resolve --applied 20260530133049_init
npx prisma migrate resolve --applied 20260530150840_required_email_message

echo "==> Готово. Проверка:"
npx prisma migrate status

echo ""
echo "Затем примените новые миграции: npx prisma migrate deploy"
