# Undefined

## Contexte

Undefined est un site internet ayant pour but d'éveiller les consciences face aux violences et discriminations subient par la communauté LGBTQIA+

## Installation

### Pré-requis :

- [Node.JS](https://nodejs.org/en/download/)

### Commande et démarrage

- Dans le terminal : `git clone https://github.com/MaxLepan/undefined.git`
- Dans le terminal l'IDE : `npm i`
- Dans le terminal de l'IDE : `node server.js`

## Architecture

![Architecture](https://cdn.discordapp.com/attachments/896329209482448917/917469818305790063/Fichier_12x.png)

## Flux de données

![Flux de données](https://media.discordapp.net/attachments/896329209482448917/917487298558439457/Schema_flux_donnees-100.jpg?width=734&height=467)

## Choix techniques

### [Mapbox](https://docs.mapbox.com/mapbox-gl-js/)

Nous avons choisi Mapbox GL pour la visualisation de la carte car nous avons vu que cette API pouvait faire ce que nous voulions faire, à savoir des filtres et des ajouts de couches pour visualiser les pays ou leurs centres géographiques.

### [Twitter API](https://developer.twitter.com/en/docs/twitter-api)

Nous avons utilisé l'API de Twitter afin de récupérer en temps réel les tweets contenant le #LGBT grâce au package Node `twitter`.

### [OpenAI](https://beta.openai.com/docs/introduction)

Nous avons utilisé l'API de OpenAI pour avoir le sentiment général (positif ou négatif) du tweet récupéré. 

### [MongoDB](https://docs.mongodb.com/)

Nous avons utilisé MongoDB comme système de base de données car nous n'avons besoin que de documents, que nous avons répartis dans plusieurs collections.
