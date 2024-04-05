FROM node:latest

WORKDIR /usr/src/app

RUN git clone https://github.com/yourusername/your-repo.git .

RUN npm install

ENV PORT=3000

EXPOSE PORT

CMD ["npm", "run", "start", "--", "$PORT"]