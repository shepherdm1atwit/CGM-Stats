FROM node:lts-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json  ./
COPY index.html ./
COPY vite.config.js ./
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm run build

FROM caddy:alpine
EXPOSE 80
EXPOSE 443
COPY --from=build-step /app/dist /usr/share/caddy