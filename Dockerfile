FROM node:18-alpine

# Install openssl for Prisma query engine compatibility
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install dependencies (using legacy peer deps to bypass TypeScript version conflicts)
RUN npm install --legacy-peer-deps

# Copy database schema and generate Prisma Client inside container
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the Next.js production bundle
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Push schema updates and start Next.js production server
CMD ["sh", "-c", "npx prisma db push && npm run start"]
