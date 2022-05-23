FROM python:3.8

WORKDIR /app/

COPY . .
RUN pip install poetry

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ./entrypoint.sh
