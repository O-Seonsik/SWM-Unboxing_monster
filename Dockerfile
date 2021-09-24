FROM node:14

WORKDIR /app
COPY . .
RUN npm i --quiet

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
