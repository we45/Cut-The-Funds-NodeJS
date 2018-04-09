FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install && npm install pm2 -g
COPY . /app
EXPOSE 3000
CMD pm2 start --no-daemon ./bin/www
