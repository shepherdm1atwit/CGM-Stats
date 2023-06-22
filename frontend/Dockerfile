FROM node:lts-alpine as build-step
ADD ./ ./app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install && npm run build

FROM caddy:alpine
EXPOSE 80
EXPOSE 443
COPY --from=build-step /app/dist /usr/share/caddy