FROM node:12.18.3-alpine

WORKDIR /server

COPY package*.json ./

RUN npm ci --silent

COPY . .

ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build \
  && npm prune --production \
  && rm -rf ./src ./api \
  && npm cache clean --force

CMD ["npm", "start"]
