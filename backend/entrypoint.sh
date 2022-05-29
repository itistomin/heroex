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
echo "Uploading dump data"
poetry run python manage.py loaddata dumps/dump_26_05_2022.json

echo ""
echo "Server start up"
poetry run python manage.py runserver  0.0.0.0:$PORT
