FROM node:15.6.0-alpine

WORKDIR /server

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build \
  && npm prune --production \
  && rm -rf ./src ./api \
  && npm cache clean --force

CMD ["npm", "start"]
