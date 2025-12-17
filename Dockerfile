FROM node:24.12.0-alpine

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm*.yaml /app/
COPY . .

RUN pnpm i --frozen-lockfile
RUN pnpm gen
RUN pnpm build

CMD ["pnpm", "start"]