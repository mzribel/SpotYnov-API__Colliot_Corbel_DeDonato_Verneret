# TP 3 - SpotYnov API

Rendu du TP 3 du cours de développement back-end par **Théo Colliot-Martinez**, **Marianne Corbel**, **Tony De Donato** et **Nils Verneret**.

## Prérequis 

L'utilisateur doit avoir créé une application Spotify sur le [dashboard](https://developer.spotify.com/dashboard) de son compte personnel et y avoir rempli les champs suivants :
- **Redirect URI** : `http://localhost:3000/auth/spotify/callback`
- **APIs used** : `Web API`

Une fois créée, l'utilisateur pourra y récupérer son `client ID` et son `client secret` qui seront à renseigner dans le fichier `/SpotYnov_API/.env` 

## Spécifications techniques

L'API présentée a été réalisée à l'aide d'**ExpressJS**.

**Versions** :
- npm 10.9
- Node 22 (LTS)

Client API recommandé : **Postman**

## Installation

Pour récupérer le projet depuis GitHub : 
```
git clone https://github.com/mzribel/SpotYnov-API__Colliot_Corbel_DeDonato_Verneret.git
```

Le projet ne contient pour l'instant qu'une seule partie (dossier) : 
- `/SpotYnov_API` : L'API elle-même

Dans les deux cas, les modules nodes doivent être installés dans chacun des deux dossiers avec la commande `npm i`.

### API

 L'utilisateur doit renommer le fichier `/SpotYnov_API/.env.example` en `/SpotYnov_API/.env` et y remplir à minima les variables `SPOTIFY_CLIENT_ID` et `SPOTIFY_CLIENT_SECRET` avec les informations liées à l'application spotify créée au préalable (voir prérequis).

Ensuite, le serveur peut être lancé à l'aide de la commande suivante :
```
npm start
``` 

Il sera par défaut disponible sur le port **3000** de la machine.

## Documentation

Une documentation précise de l'API a été réalisée avec [Swagger](https://swagger.io/tools/swagger-editor/) et est disponible à l'URL suivante de l'API :
```
http://localhost:3000/documentation
```

Les fonctionnalités suivantes ont été implémentées :
- ...
  
## Fonctionnalités additionnelles

Plusieurs fonctionnalités ont été ajoutées au projet pour le rendre plus agréable à utiliser :
- Cache et rate limiter intégrés à l'API
- Système de logs de l'API qui peuvent être consultés dans le dossier `spotify_api/logs/`
