FROM node:18-alpine
WORKDIR /app
COPY server.js ./
RUN npm init -y && npm i express body-parser
EXPOSE 5000
CMD ["node", "server.js"]


