<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">An incredible exercise to test a <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Architecture of the Project

This service follows Domain-Driven Design (DDD) principles and is structured as follows:

```text
├── application/          # Application layer - orchestrates use cases and domain logic
│   └── business-cases/   # Domain business operations (services)
│
├── domains/              # Domain layer containing entities, value objects, aggregates and factories
│   └── entities/         # Entity implementations
│
├── infrastructure/       # Layer handling external configurations and integrations
│   └── persistence/      # Database implementations and ORM configurations
│
└── presentation/         # Layer handling external service exposure and interfaces
    ├── controllers/      # REST API controllers
    └── dto/              # Data Transfer Objects for request validation
```

## Try the service locally

the service need a mysql server to work correctly. For this i prepare a simple docker-compose

```bash
$ docker-compose up --build
```

## Run tests

```bash
# unit tests
$ npm run test
# e2e tests
$ npm run test:e2e
# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
