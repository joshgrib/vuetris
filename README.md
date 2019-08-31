# vuetris

[Play it now](https://vuetris.web.app/)

## TODO

- [x] Set up game board
- [x] Set up firebase hosting & publishing
- [x] Get blocks to drop to down the screen and stop when they hit something
- [x] Add controls to move blocks
- [x] Detect when the game is lost
- [x] Add other block types
- [x] Add controls to rotate blocks
- [x] Detect full rows and remove them
- [x] Shift blocks down when a row is removed
- [x] Track score
- [ ] Fix block rotation bugs
- [ ] Fix collision bugs
- [ ] Improve styling

> Note: [this similar game](https://binaryify.github.io/vue-tetris/) has a cool style

## Quickstart

1. Clone the repo
2. Run `yarn` to install dependencies
3. Run `yarn serve` to start the dev server
4. Navigate to the URL shown to play (most likely `localhost:8080`)

## Commands

* `yarn` - install dependencies
* `yarn serve` - compiles and hot-reloads for development
* `yarn deploy` - build for production and deploy to [Firebase](https://firebase.google.com/)
* `yarn build` - compiles and minifies for production
* `yarn lint` - lint and fix files
* `yarn test` - run tests
* `yarn test:e2e` - run end-to-end tests with [Cypress](https://www.cypress.io/)
* `yarn test:unit` - run unit tests with [Jest](https://jestjs.io/)

> If you look in the `package.json` scripts you will see that there commands mostly run with 
> the [Vue CLI](https://cli.vuejs.org/), the [configuration reference](https://cli.vuejs.org/config/)
> has information and additional functionality
