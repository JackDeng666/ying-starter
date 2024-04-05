<h1 align="center">Ying Starter</h1>

- [English](README.md)

## 简介

这是一个使用 pnpm 的 monorepo 架构的全栈项目，基于 React 和 NestJS 实现了基本的后台管理系统的角色权限控制逻辑，包含一个NextJS的客户端，集成了基本的注册登录逻辑和谷歌、github、Facebook 的 oauth 登录。

后台管理端

- Vite
- React
- Ant Design UI
- zustand
- react-hook-form

客户端

- Vite
- React
- shadcn-ui
- zustand
- react-hook-form

服务端

- Nestjs
- TypeORM
- MySQL
- Redis
- MinIO

角色权限控制目录在 `apps\server\src\common\permission\modules` 里去控制，每次更新会覆盖数据库。

在服务端有个特殊的目录 `apps\server\src\shared`，这个目录用来存放 `DTO` , `VO` 和数据库的 `Entity` 对象，两套前端代码都在对应的 `tsconfig.json` 文件中配置了特殊前缀指向这个目录，这样前端代码可以轻松获取服务端已经写好的数据类型，同时配合 `react-hook-form` 和 `@hookform/resolvers/class-validator`，传入对应的 `DTO` 后， 可以让前后端公用同一套数据校验逻辑。

## 开发环境版本参考

- node v18.18.2
- pnpm v8.15.3

## 开发环境启动

修改 `apps\server\.env` 文件的配置。

```shell
pnpm i
pnpm build-pkg
pnpm dev
```

## docker 部署

项目根目录写了 Dockerfile 文件，直接使用 docker 的打包命令打包一个镜像。

```shell
docker build -t ying-starter:test .
```

启动容器参考。

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
