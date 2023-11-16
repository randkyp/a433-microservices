# use Node.js 14 LTS release to ensure compatibility with old amqplib
FROM node:fermium-alpine
# set working directory
WORKDIR /order-service
# copy all files from the current directory to the workdir inside the container
# (excluding files and folders listed in .dockerignore)
COPY . .
# install npm packages, making sure to stick to versions explicitly defined in
# package-lock.json
RUN npm ci
# add wait-for-it script
RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh
# annotate the app's port, as defined in .env
EXPOSE 3000
# run the order-service app
CMD ["npm", "run", "start"]