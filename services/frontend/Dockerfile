FROM node:latest as build

WORKDIR /app
COPY ./ /app
RUN npm install && npm run build-only



FROM nginx:latest as prod

ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}/tcp

COPY --from=build /app/dist /var/www/app/

WORKDIR /etc/nginx
COPY ./nginx.conf.template /etc/nginx

RUN DOLLAR='$' envsubst < ./nginx.conf.template > ./nginx.conf



FROM node:latest as dev

ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}/tcp

WORKDIR /app

CMD npm install && npx vite --host --port ${PORT}