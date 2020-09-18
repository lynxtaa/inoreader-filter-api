FROM node:12.18.3 as builder

WORKDIR /build

COPY package*.json ./

RUN npm ci --silent

COPY . .

ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build \
  && npm prune --production \
  && rm -rf ./src ./api

FROM node:12.18.3-alpine

WORKDIR /server

COPY --from=builder /build .

CMD ["npm", "start"]
