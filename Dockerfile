# set up base image (node v14)
FROM node:14
# set container working directory to /app (inside the container, ofc)
WORKDIR /app
# copy source code in current directory to workdir
COPY . .
# set environment variables for production mode
ENV NODE_ENV=production DB_HOST=item-db
# install prod mode depedencies
RUN npm install --production --unsafe-perm && npm run build
# expose app port
EXPOSE 8080
# launch app by running `npm start` inside the container
CMD ["npm", "start"]