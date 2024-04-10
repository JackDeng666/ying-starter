FROM node:18-alpine AS base

FROM base AS nestjsbuilder

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./

COPY packages/hooks/package.json packages/hooks/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/server/package.json apps/server/package.json

RUN pnpm i

COPY ./apps/admin ./apps/admin
COPY ./apps/server ./apps/server
COPY ./packages ./packages
COPY .prettierrc .prettierrc
COPY .prettierignore .prettierignore

RUN pnpm -r build

RUN mkdir /app/apps/server/static

RUN cp -r /app/apps/admin/dist/ /app/apps/server/static/admin/

RUN pnpm prune --prod

FROM base AS nextjsbuilder

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY packages/hooks/package.json packages/hooks/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY apps/client/package.json apps/client/package.json

RUN pnpm i

COPY ./apps/client ./apps/client
COPY ./apps/server/src/shared ./apps/server/src/shared
COPY ./packages ./packages
COPY .prettierrc .prettierrc
COPY .prettierignore .prettierignore

RUN pnpm -r build

FROM base AS runner

WORKDIR /app

COPY --from=nestjsbuilder /app/apps/server ./apps/server
COPY --from=nestjsbuilder /app/node_modules ./node_modules
COPY --from=nestjsbuilder /app/packages ./packages

COPY --from=nextjsbuilder /app/apps/client/.next/standalone ./
COPY --from=nextjsbuilder /app/apps/client/public ./apps/client/public
COPY --from=nextjsbuilder /app/apps/client/.next/static ./apps/client/.next/static

COPY ./prod.sh ./prod.sh

ENV NODE_ENV prod

ENV PORT 3256
EXPOSE 3256

ENV SERVER_PORT 3000
EXPOSE 3000

CMD source ./prod.sh
