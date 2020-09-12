FROM node:12.18.3 as builder

WORKDIR /server

COPY package*.json ./

RUN npm ci --silent

COPY . .

RUN npm run build \
  && npm prune --production \
  && npm cache clean --force \
  && rm -rf ./src ./api

FROM node:12.18.3-alpine

WORKDIR /server

COPY --from=builder . .

CMD ["npm", "start"]
