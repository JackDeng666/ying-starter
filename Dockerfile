FROM node:18-alpine AS base

FROM base AS builder

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml ./

RUN pnpm config set registry https://registry.npmmirror.com

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV prod

RUN pnpm build

RUN cp -r /app/dist/apps/admin/ /app/dist/apps/server/assets/admin/

RUN pnpm prune --prod --no-optional

RUN rm -rf /app/dist/apps/client/.next/cache

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY ./prod.sh ./prod.sh

ENV NODE_ENV prod

ENV PORT 3256
EXPOSE 3256

ENV SERVER_PORT 3000
EXPOSE 3000

CMD source ./prod.sh
