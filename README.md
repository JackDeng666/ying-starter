<h1 align="center">Ying Starter</h1>

- [简体中文](README.zh_CN.md)

## 简介

This is a full stack project using the Monorepo architecture of PNPM. Based on React and NestJS, it implements the basic role permission control logic of the backend management system, including a NextJS client that integrates basic registration and login logic with oauth login for Google, Github, and Facebook.

Admin side

- Vite
- React
- Ant Design UI
- zustand
- react-hook-form

Modified from another open-source project [slash-admin](https://github.com/d3george/slash-admin).

Client side

- Vite
- React
- Next UI
- zustand
- react-hook-form

Server side

- Nestjs
- TypeORM
- MySQL
- Redis
- MinIO

Role permissions are controlled in the `apps\server\src\common\permission\modules` directory, and each update will overwrite the database.

There is a special directory on the server side `apps\server\src\shared`, this directory is used to store `DTO` , `VO`, and the `Entity` objects of the database, Both sets of front-end code are configured with a special prefix pointing to this directory in the corresponding `tsconfig. json` file, this way, the front-end code can easily obtain the data types already written by the server，By combining the `react-hook-form` and `@hookform/resolvers/class-validator`, the corresponding `DTO` can be passed in, allowing the front-end and back-end to share the same set of data validation logic.

## Development environment version

- node v18.18.2
- pnpm v8.15.3

## Development environment startup

Modify the configuration of the `apps\server\.env` file.

```shell
pnpm i
pnpm build-pkg
pnpm dev
```

## docker deploy

The root directory of the project has written a Dockerfile file, and you can directly use Docker's packaging command to package an image.

```shell
docker build -t ying-starter:test .
```

Start container.

```shell
docker run --name ying-starter -d \
  -p 3000:3000 \
  -p 3256:3256 \
  -e API_URL=http://localhost:3000/api/client \
  -e DOMAIN=localhost \
  -e SERVER_URL=http://localhost:3000 \
  -e REDIS_HOST=kubernetes.docker.internal \
  -e REDIS_PORT=6379 \
  -e REDIS_PASSWORD=ying123456 \
  -e DB_HOST=kubernetes.docker.internal \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_PASSWORD=ying123456 \
  -e DB_NAME=ying_starter \
  -e MINIO_HOST= \
  -e MINIO_PORT= \
  -e MINIO_BUCKET= \
  -e MINIO_ACCESS_KEY= \
  -e MINIO_SECRET_KEY= \
  -e MAIL_HOST= \
  -e MAIL_PORT= \
  -e MAIL_USER= \
  -e MAIL_AUTH_CODE= \
  -e AUTH_ADMIN_SECRET=  \
  -e AUTH_ADMIN_NAME=admin \
  -e AUTH_ADMIN_PASS=Admin.123 \
  -e AUTH_ADMIN_EXPIRES_IN=1d \
  -e AUTH_SECRET= \
  -e AUTH_EXPIRES_IN=7d \
  -e AUTH_REDIRECT_URL=http://localhost:3256 \
  -e AUTH_GITHUB_ID= \
  -e AUTH_GITHUB_SECRET= \
  -e AUTH_GOOGLE_ID= \
  -e AUTH_GOOGLE_SECRET= \
  -e AUTH_FACEBOOK_ID= \
  -e AUTH_FACEBOOK_SECRET= \
  ying-starter:test
```
