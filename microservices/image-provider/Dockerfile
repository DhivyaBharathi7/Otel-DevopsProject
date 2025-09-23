FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy images and icons from frontend
COPY ../frontend/public/images ./public/images
COPY ../frontend/public/icons ./public/icons

EXPOSE 8081

CMD ["npm", "start"]