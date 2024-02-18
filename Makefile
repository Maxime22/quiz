# Construire l'image Docker et démarrer les services avec docker-compose
build:
	docker compose up --build -d

install:
	docker compose run --rm app npm install

test:
	docker compose run --rm app npm test

.PHONY: coverage
coverage:
	docker compose run --rm app npx jest --coverage

# Dans docker-compose run pas besoin de -it
shell:
	docker compose run --rm app /bin/sh

prettier:
	docker compose run --rm app npx prettier . --write
