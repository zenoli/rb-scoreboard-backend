# Build stage
FROM node:20.14-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY tsconfig.json .
RUN npm run build

# Production stage
FROM node:20.14-alpine AS server
COPY package*.json ./
COPY tsconfig.json .
RUN npm install --production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3001

CMD [ "npm", "run", "start" ]

