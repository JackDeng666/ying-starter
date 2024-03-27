<h1 align="center">Ying Starter</h1>

## 开发环境版本参考

- node v18.18.2
- pnpm v8.15.3

## 1. 开发环境启动

修改 `apps\server\.env` 文件的配置。

```shell
pnpm i
pnpm build-pkg
pnpm dev
```

## 2. 部署

项目根目录写了 Dockerfile 文件，直接使用 docker 的打包命令打包一个镜像。

```shell
docker build -t ying-starter:test .
```

然后启动容器本地部署。

```shell
docker run --name ying-starter -d \
  -p 3000:3000 \
  -p 3256:3256 \
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
