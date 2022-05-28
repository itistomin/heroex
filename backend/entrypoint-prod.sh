#!/bin/bash

echo ""
echo "Dependencies install"
poetry install

echo ""
echo "Apply migrations"
poetry run python manage.py migrate

echo ""
echo "Creating superuser"
poetry run python manage.py createsuperuser --noinput

poetry run python backend/manage.py runserver 0.0.0.0:$PORT
