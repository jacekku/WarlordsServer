# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.6](https://github.com/jacekku/TraviansServer/compare/v0.1.5...v0.1.6) (2021-08-30)


### Features

* renaming game to Warlords Online ([05ba206](https://github.com/jacekku/TraviansServer/commit/05ba206ffa850da4d3a48220b6d785f7421ecadc))


### Bug Fixes

* fixing https handling ([4f594dc](https://github.com/jacekku/TraviansServer/commit/4f594dc2e12ff3d7a694aa69911a8bc68fa50f60))
* fixing names and adding https handling ([f973f8b](https://github.com/jacekku/TraviansServer/commit/f973f8b70a3a21e390688ee9ff0490d394623f55))
* Removed an issue where a disconnecting player would crash the server if there was another websocket connected with the same name that already disconnected ([71c4ec7](https://github.com/jacekku/TraviansServer/commit/71c4ec7c13f4d0f7a859c9647adffa621ce6570a))

### [0.1.5](https://github.com/jacekku/TraviansServer/compare/v0.1.4...v0.1.5) (2021-08-26)


### Features

* Adding docker compose ([e179c21](https://github.com/jacekku/TraviansServer/commit/e179c211fc0b487e2ae78abdb4f4420b16323b9a))


### Bug Fixes

* **docker:** fixing docker-compose version ([1f18edd](https://github.com/jacekku/TraviansServer/commit/1f18edd1a3c3b8ef584d7fa64aea812f0acc2e5b))

### [0.1.4](https://github.com/jacekku/TraviansServer/compare/v0.1.3...v0.1.4) (2021-08-25)


### Features

* Adding build tag for docker images ([51aafbf](https://github.com/jacekku/TraviansServer/commit/51aafbf4e8d0c9169547deb555b057415b9af18b))
* Docker CI ([2aa4799](https://github.com/jacekku/TraviansServer/commit/2aa4799bc57305905661a0f3962b3b154e3f2d52))

### 0.1.3 (2021-08-24)


### Bug Fixes

* **persistence:** fixed recursive black hole while creating new player ([3689978](https://github.com/jacekku/TraviansServer/commit/3689978bfb63603933612cfd863dd29dc4c86761))
* **terrain:** adding handling for empty DEFAULT_TERRAIN ([846260b](https://github.com/jacekku/TraviansServer/commit/846260b946d1126a782784f05476d122787a69d1))
