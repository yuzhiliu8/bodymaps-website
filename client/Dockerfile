FROM "node:18-alpine"

#WORK DIRECTORY
WORKDIR /app

ARG VITE_API_ORIGIN=""
ARG VITE_BASENAME=""

ENV VITE_API_ORIGIN=${VITE_API_ORIGIN}
ENV VITE_BASENAME=${VITE_BASENAME}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve 

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
