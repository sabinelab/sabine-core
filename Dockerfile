FROM node:24.11.0-alpine AS builder

ARG GITHUB_AUTH_TOKEN

RUN corepack enable pnpm
WORKDIR /app

RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_AUTH_TOKEN}" > .npmrc

COPY package.json pnpm*.yaml /app/

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm build

RUN rm .npmrc

FROM node:24.11.0-alpine

RUN corepack enable pnpm

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/prisma ./prisma

CMD ["pnpm", "start"]