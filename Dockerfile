FROM arm32v7/node:carbon

WORKDIR /server

COPY package*.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]

EXPOSE 7000
