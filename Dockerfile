# syntax=docker/dockerfile:1
#
# Static image: production bundle served by nginx, configured at runtime (docker/40-env-config.sh).
#   docker build -t labcabrera/rmu-mfe-shell:local .   (`make docker-build`)

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 docker/40-env-config.sh /docker-entrypoint.d/40-env-config.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
