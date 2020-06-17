FROM node:14

#Environment Variables
ENV DATABASE_URI mongodb://ideagarden:secretpassword@localhost:27017
ENV HASH_SECRET shhhhh
ENV EMAIL_HOST localhost
ENV EMAIL_USER info@ideagarden.local
ENV EMAIL_PORT 25
ENV EMAIL_PASS hushhush
ENV DEFAULT_EMAIL info@ideagarden.local
ENV PORT 8080

# Create app directory
RUN mkdir -p /ideaGarden
WORKDIR /ideaGarden

# Install
COPY package.json /ideaGarden
COPY gulpfile.js /ideaGarden
COPY ./src /ideaGarden/src


# Bundle app source
RUN npm install
RUN npm run build

VOLUME /ideaGarden/build/imageData

EXPOSE 80
CMD ["npm", "start"]
