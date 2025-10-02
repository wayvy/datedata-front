# syntax=docker/dockerfile:1.7-labs

ARG NODE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginx:alpine

FROM ${NODE_IMAGE} AS dependencies

WORKDIR /code

COPY .yarn/ .yarn/
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY package.json ./
COPY turbo.json ./

RUN corepack enable
RUN yarn set version 4.5.0

FROM dependencies AS packages

COPY --parents config/*/package.json .
COPY --parents packages/*/package.json .
COPY --parents apps/*/package.json .

FROM packages AS installer

RUN yarn install
RUN yarn cache clean --all

FROM installer AS source

ARG APP

COPY config/ config/
COPY packages/types/ packages/types/
COPY packages/utils/ packages/utils/
COPY packages/models/ packages/models/
COPY packages/stores/ packages/stores/
COPY packages/ui/ packages/ui/
COPY apps/${APP} apps/${APP}

FROM source AS builder

ARG API_URL
ENV VITE_API_URL=$API_URL

RUN yarn build

FROM ${NGINX_IMAGE} AS nginx

ARG APP

COPY --from=builder /code/apps/${APP}/dist /usr/share/nginx/html
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]