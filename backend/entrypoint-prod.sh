#!/bin/bash

echo ""
echo "Apply migrations"
python manage.py migrate

echo ""
echo "Creating superuser"
python manage.py createsuperuser --noinput

echo ""
echo "Server start up"
python manage.py runserver  0.0.0.0:$PORT
