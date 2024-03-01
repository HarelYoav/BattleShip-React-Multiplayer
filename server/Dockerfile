# Fetching the minified node image on apline linux
FROM --platform=linux/amd64 node:slim AS builder



# Setting up the work directory
WORKDIR /app


# Installing dependencies
COPY ./package.json ./
RUN npm install

# Copying all the files in our project
COPY . .

RUN npm run build



FROM node:12-alpine AS server

WORKDIR /app

COPY package* ./

RUN npm install --production

# # Copying built assets from builder 
COPY --from=builder ./app/dist ./dist

# # Installing pm2 globally
# RUN npm install pm2 -g

# # Starting our application
# CMD pm2 start process.yml && tail -f /dev/null

# Exposing server port
EXPOSE 5000

CMD ["npm", "start"]