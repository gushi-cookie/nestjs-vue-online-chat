FROM node:latest AS production

WORKDIR /app
COPY ./ /app

RUN npm install && npm run build
RUN apt update && apt -y install tzdata

CMD ["npm", "run start"]



FROM node:latest AS development

WORKDIR /app
RUN apt update && apt -y install tzdata

CMD ["sh", "-c", "npm install && npm run start:dev"]