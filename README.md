<h1 align="center">Ying Starter</h1>

- [简体中文](README.zh_CN.md)

## Introduction

This is a monorepo full-stack project that uses pnpm + turborepo for management. It implements the basic role permission control logic of the backend management system based on React and NestJS. It includes a TanStack Start client that integrates basic registration login logic and oauth login from Google and Github.

Backend Management

- Vite
- React
- Tailwind CSS
- Ant Design
- Zustand
- React Hook Form

Client

- Vite
- TanStack Start
- React
- Tailwind CSS
- Shadcn/ui
- Zustand
- React Hook Form

Server

- Nestjs
- TypeORM
- MySQL
- Redis
- MinIO

## Development environment version

- node v24.15.0
- pnpm v10.33.4

## Startup of development environment

Refer to the `apps\server\.env` file, add a `.env.local` file (which has been ignored by git), and modify the environment variables accordingly.

```shell
pnpm i
pnpm build:pkgs
pnpm dev
```

## docker deploy

First use turbo to generate clean dependency files for docker cache.

```bash
rm -rf out
pnpm turbo-prune
```

A Dockerfile is written in the project root directory, and the server image can be packaged using docker's packaging command.

```shell
docker build --platform=linux/amd64 --target server -t ying-server:1.0.0 .
```

Start the server container reference.

```shell
docker run --name ying-server -d \
  -p 5090:5090 \
  -e APP_ENV=prod \
  -e SERVER_PORT=5090 \
  -e REDIS_HOST=host.docker.internal \
  -e REDIS_PORT=6379 \
  -e REDIS_PASSWORD=ying123456 \
  -e REDIS_DB=0 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=ying123456 \
  -e DB_NAME=ying \
  -e STORAGE_MODE=local \
  ...
  ying-server:1.0.0
```

If object storage uses local mode and needs to save files within the container, you can add a mapping to `/app/uploadfiles` within the container.
