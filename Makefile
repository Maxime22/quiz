# Construire l'image Docker et démarrer les services avec docker-compose
build:
	docker-compose build

install:
	docker compose run --rm app npm install

jest:
	docker compose run --rm app npx jest

test: jest cypress

start:
	docker compose up -d app

cypress: start
	docker compose run --rm cypress

.PHONY: coverage
coverage:
	docker compose run --rm app npx jest --coverage

# Dans docker-compose run pas besoin de -it
shell:
	docker compose run --rm app /bin/sh

prettier:
	docker compose run --rm app npx prettier . --write
