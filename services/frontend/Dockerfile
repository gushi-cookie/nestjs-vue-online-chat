FROM node:latest AS build

WORKDIR /app
COPY ./ /app
CMD ["sh", "-c", "npm install && npm run build-only"]



FROM nginx:latest AS production
COPY --from=build /app/dist /var/www/app/

WORKDIR /etc/nginx
COPY ./nginx.conf.template /etc/nginx

RUN DOLLAR='$' envsubst < ./nginx.conf.template > ./nginx.conf



FROM node:latest AS development

WORKDIR /app

CMD ["sh", "-c", "npm install && npm run dev"]