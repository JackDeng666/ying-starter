FROM node:18-alpine AS base

FROM base AS dep

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

COPY .npmrc package.json pnpm-lock.yaml ./

RUN pnpm config set registry https://registry.npmmirror.com

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM dep AS builder

COPY . .

ENV NODE_ENV production

RUN pnpm build

RUN cp -r /app/dist/apps/admin/ /app/dist/apps/server/assets/admin/

RUN rm -rf /app/dist/apps/client/.next/cache

FROM dep AS cleaner

RUN pnpm prune --prod --no-optional

FROM base AS runner

WORKDIR /app

COPY --from=cleaner /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY ./prod.sh ./prod.sh

ENV NODE_ENV production

ENV PORT 3256
EXPOSE 3256

ENV SERVER_PORT 3000
EXPOSE 3000

CMD source ./prod.sh
