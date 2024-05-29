# We're using the official Python 2.7 image as the base
# This is due to the fact that old versions of node-sass
# require Python 2.7 to work
FROM python:2.7

# Install Node.js 8
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
SHELL ["/bin/bash", "-c"]
RUN source ~/.bashrc && nvm install 8 && nvm use 8

WORKDIR /usr/src/app

COPY package*.json ./

RUN source ~/.bashrc && npm install

COPY . .

RUN source ~/.bashrc && npm run build

EXPOSE 8080

WORKDIR /usr/src/app/build

CMD ["bash", "-c", "source ~/.bashrc && npm run start"]
