FROM nginx:latest

ARG PORT
ENV PORT=${PORT}

ARG FRONTEND_PORT
ENV RONTEND_PORT=${RONTEND_PORT}

ARG BACKEND_PORT
ENV BACKEND_PORTT=${BACKEND_PORTT}


WORKDIR /etc/nginx
COPY ./nginx.conf.template /etc/nginx

RUN DOLLAR='$' envsubst < ./nginx.conf.template > ./nginx.conf