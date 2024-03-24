# Quiz

Quiz pour apprendre des choses =)

## Installation basique

Suivez ces étapes pour installer et configurer le projet sur votre machine locale.

- `git clone`

## Tests

**Si vous voulez pouvoir lancer les tests, assurez-vous d'avoir installé :**

- Docker
- Docker Compose

**Construisez l'image Docker de l'application :**

- `make build` : cette commande va construire l'image Docker nécessaire pour exécuter l'application, en se basant sur les instructions fournies dans le fichier docker-compose.yml.

**Installer les dépendances externes (npm) :**

- `make install` : installer les dépendances dans le container et le changement se fera également sur votre environnement local

**Exécuter les tests :**

- `make jest`
- `make cypress`

**Utilisation de Netlify en local**
- Installer node/npm sur votre machine si vous ne l'avez pas
- Installer netlify CLI (`npm install netlify-cli -g`)
- Linker à un projet netlify existant : à la racine du projet `netlify link`
- Rajouter dans un .env les valeurs qui sont également dans votre compte Netlify pour pouvoir tester en local
- Lancer le serveur `netlify dev`

Le push sur main déploiera la version automatiquement sur Netlify et donc en prod