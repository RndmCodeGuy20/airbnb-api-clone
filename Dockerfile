FROM node:latest
LABEL authors="SHANTANU"

#ENTRYPOINT ["top", "-b"]

# Build the image
WORKDIR /app

# Copy the package.json file and package-lock.json file
COPY package*.json ./

# Install the dependencies
RUN npm install
RUN npm install -g nodemon
RUN npm install -g cross-env

# Copy the source code
COPY . .

# Expose the port
EXPOSE 5500

# Start the application
CMD ["npm", "run", "dev"]
