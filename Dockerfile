FROM node:18-alpine
WORKDIR /
COPY public/ /public
COPY src/ /src
COPY package.json /
RUN npm install
CMD ["npm", "start"]