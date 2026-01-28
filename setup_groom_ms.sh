#!/bin/bash
# Install dependencies
pnpm install

# Generate Prisma Client
cd server/groom-ms
npx prisma generate

# Go back to root
cd ../../
