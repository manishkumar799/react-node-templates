#!/usr/bin/env sh
set -e
until pg_isready -h localhost -p 5432 -U postgres; do
echo "Waiting for postgres..."
sleep 2
done
echo "Postgres is ready"