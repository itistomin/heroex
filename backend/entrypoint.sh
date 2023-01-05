#!/bin/bash

echo ""
echo "Apply migrations"
poetry install

echo ""
echo "Apply migrations"
poetry run python manage.py migrate

echo ""
echo "Creating superuser"
poetry run python manage.py createsuperuser --noinput

echo ""
echo "Collect static files"
poetry run python manage.py collectstatic --noinput

echo ""
echo "Uploading dump data"
poetry run python manage.py loaddata dumps/dump_06_06_22.json

echo ""
echo "Server start up"
poetry run python manage.py runserver  0.0.0.0:$PORT
