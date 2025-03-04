FROM node:20-alpine

WORKDIR /home/komputer

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev", "--", "--host"]
