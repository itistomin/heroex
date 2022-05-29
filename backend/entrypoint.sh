#!/bin/bash

echo ""
echo "Apply migrations"
poetry run python manage.py migrate

echo ""
echo "Creating superuser"
poetry run python manage.py createsuperuser --noinput

echo ""
echo "Server start up"
poetry run python manage.py runserver  0.0.0.0:8000
