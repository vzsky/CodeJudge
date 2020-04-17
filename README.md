<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>


## Description

Nest framework TypeScript - CodeJudge
[API Document] (https://documenter.getpostman.com/view/8376434/Szf53Udn) of this project

## Installation

-   Install Redis (download to root dir) then make
-   Make sure the dirname is redis

```bash
$ yarn
```

## Running the app

Run Redis first

```
# Redis server at localhost:6379
$ yarn redis
```

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# debug mode ( Not Recommended since we have uploads )
$ yarn start:debug

# production mode
$ yarn start:prod
```

## Test
Don't give it a try. Read To do next section. lol  
Too Lazy to make tests
```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## TO DO NEXT
- make tests
- give admin permission
- better judge script
- websocket
- etc.........

## License

Nest is [MIT licensed](LICENSE).
