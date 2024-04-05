FROM node:latest

WORKDIR /usr/src/app

RUN git clone https://github.com/SamuelBarondaSilva/EasyApi.git .

RUN npm install

ENV PORT=3000

EXPOSE PORT

CMD ["npm", "run", "start", "--", "$PORT"]