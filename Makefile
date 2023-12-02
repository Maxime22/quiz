IMAGE_NAME=quiz-app

# Construire l'image Docker et démarrer les services avec docker-compose
build:
	docker-compose up --build -d

install:
	docker-compose run --rm app npm install

test:
	docker-compose run --rm app npm test

# Dans docker-compose run pas besoin de -it
shell:
	docker-compose run --rm app /bin/sh
