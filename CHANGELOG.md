# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.2](https://github.com/jacekku/TraviansServer/compare/v0.4.1...v0.4.2) (2022-10-28)

## [0.4.0](https://github.com/jacekku/TraviansServer/compare/v0.3.0...v0.4.0) (2022-02-15)


### ⚠ BREAKING CHANGES

* **database:** Adding mongodb

### Features

* **database:** Adding mongodb ([9695ef1](https://github.com/jacekku/TraviansServer/commit/9695ef1cdfcf0ee5b8ed337c38549e24901c2a54))

## [0.3.0](https://github.com/jacekku/TraviansServer/compare/v0.2.0...v0.3.0) (2021-10-02)


### ⚠ BREAKING CHANGES

* Timer system

### Features

* **sound:** Sound System ([1e81bf0](https://github.com/jacekku/TraviansServer/commit/1e81bf06dbde9c4f99e12816ed7f2b0951c56746))
* Timer system ([453a639](https://github.com/jacekku/TraviansServer/commit/453a63977ffd39289200bcb1d6012f3adbac637b))


### Bug Fixes

* additional checks ([586c39a](https://github.com/jacekku/TraviansServer/commit/586c39a6ca4f69fdafae8a5d11b2816c3b49f9d0))
* **buildings:** Upgrading buildings without upgrade option no longer causes 500 ([9c85dcd](https://github.com/jacekku/TraviansServer/commit/9c85dcd48470d6be037b5b4e1d877ca556140daf))
* **players:** Disconnecting no longer crashes the server ([4b5aa28](https://github.com/jacekku/TraviansServer/commit/4b5aa28d20ac8a749a4a9240d9afc1b688b54940))

## [0.2.0](https://github.com/jacekku/TraviansServer/compare/v0.1.7...v0.2.0) (2021-09-14)


### ⚠ BREAKING CHANGES

* **buildings:** Building system

### Features

* **buildings:** Building system ([3ca3611](https://github.com/jacekku/TraviansServer/commit/3ca3611c9318ad62eedd35b981046239fb6bdfb9))
* **buildings:** Buildings now act as crafting facilities ([dde0a71](https://github.com/jacekku/TraviansServer/commit/dde0a7187423d0a71b2e168eb107fd7b605d32c9))
* controllable logging mechanism ([a4a7ac3](https://github.com/jacekku/TraviansServer/commit/a4a7ac3a361560d29e0c800d15c16a32ed28a05f))
* **items:** added sand and glass items ([6a5b3a1](https://github.com/jacekku/TraviansServer/commit/6a5b3a105d939cf13a12d100633930196b4f163a))
* **items:** New gathering handling ([3b463df](https://github.com/jacekku/TraviansServer/commit/3b463dfd669cb5569fc7b44f7eda2dc26cbf509c))


### Bug Fixes

* **security:** Added cors origin to all websockets and to the main server ([824fa1a](https://github.com/jacekku/TraviansServer/commit/824fa1aca2a2ece0e8d5821d8fcce90c01b67233))

### [0.1.7](https://github.com/jacekku/TraviansServer/compare/v0.1.6...v0.1.7) (2021-09-06)


### Features

* **items:** Crafting system ([6eab825](https://github.com/jacekku/TraviansServer/commit/6eab82578f210de6c528879b349b1946db90f88d))
* **items:** Equipable items ([70f5341](https://github.com/jacekku/TraviansServer/commit/70f53419103159cc2bf740a2812a08c89e0f35dc))
* **items:** Items can now be added to inventory ([0b574f2](https://github.com/jacekku/TraviansServer/commit/0b574f2beb7b28ebc0ecb30e48a5272ce9b9b10c))
* **items:** Items can now be equiped and unequiped ([5d79e61](https://github.com/jacekku/TraviansServer/commit/5d79e61df5c3341df67707db67d899d6c79aad81))
* **items:** Items can now have multiples of source items ([27799d5](https://github.com/jacekku/TraviansServer/commit/27799d5cdef74b5158dc0ccd7fd6419e6a93ef95))
* **items:** More item definitions ([895101d](https://github.com/jacekku/TraviansServer/commit/895101d65171db1e52cee576e69b0a1fe043a316))
* **items:** Player can move items between inventory spaces ([06e0396](https://github.com/jacekku/TraviansServer/commit/06e03965a4fe76ba981e362a295413bc8ac56dbe))


### Bug Fixes

* **items:** removing changes to test locally ([4fb5cda](https://github.com/jacekku/TraviansServer/commit/4fb5cda4499b1cabb2df4f297c5ebba36d6e2dc2))
* Player now gets only new chunks instead of all the visible chunks ([a7dbc3d](https://github.com/jacekku/TraviansServer/commit/a7dbc3d458c305a1dc93b95c3b48b41d0dac7f5e))
* **users:** Player disconnecting no longer crashes the server ([c8a23b1](https://github.com/jacekku/TraviansServer/commit/c8a23b13dcb979dbcbdab7a2ed581d755d7ceec3))

### [0.1.6](https://github.com/jacekku/TraviansServer/compare/v0.1.5...v0.1.6) (2021-08-30)

### Features

- renaming game to Warlords Online ([05ba206](https://github.com/jacekku/TraviansServer/commit/05ba206ffa850da4d3a48220b6d785f7421ecadc))

### Bug Fixes

- fixing https handling ([4f594dc](https://github.com/jacekku/TraviansServer/commit/4f594dc2e12ff3d7a694aa69911a8bc68fa50f60))
- fixing names and adding https handling ([f973f8b](https://github.com/jacekku/TraviansServer/commit/f973f8b70a3a21e390688ee9ff0490d394623f55))
- Removed an issue where a disconnecting player would crash the server if there was another websocket connected with the same name that already disconnected ([71c4ec7](https://github.com/jacekku/TraviansServer/commit/71c4ec7c13f4d0f7a859c9647adffa621ce6570a))

### [0.1.5](https://github.com/jacekku/TraviansServer/compare/v0.1.4...v0.1.5) (2021-08-26)

### Features

- Adding docker compose ([e179c21](https://github.com/jacekku/TraviansServer/commit/e179c211fc0b487e2ae78abdb4f4420b16323b9a))

### Bug Fixes

- **docker:** fixing docker-compose version ([1f18edd](https://github.com/jacekku/TraviansServer/commit/1f18edd1a3c3b8ef584d7fa64aea812f0acc2e5b))

### [0.1.4](https://github.com/jacekku/TraviansServer/compare/v0.1.3...v0.1.4) (2021-08-25)

### Features

- Adding build tag for docker images ([51aafbf](https://github.com/jacekku/TraviansServer/commit/51aafbf4e8d0c9169547deb555b057415b9af18b))
- Docker CI ([2aa4799](https://github.com/jacekku/TraviansServer/commit/2aa4799bc57305905661a0f3962b3b154e3f2d52))

### 0.1.3 (2021-08-24)

### Bug Fixes

- **persistence:** fixed recursive black hole while creating new player ([3689978](https://github.com/jacekku/TraviansServer/commit/3689978bfb63603933612cfd863dd29dc4c86761))
- **terrain:** adding handling for empty DEFAULT_TERRAIN ([846260b](https://github.com/jacekku/TraviansServer/commit/846260b946d1126a782784f05476d122787a69d1))
