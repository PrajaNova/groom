-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "groom";

-- CreateEnum
CREATE TYPE "groom"."BookingStatus" AS ENUM ('pending', 'payment_pending', 'confirmed', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "groom"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."provider_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."sessions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "device" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "event" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."bookings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "when" TIMESTAMP(3) NOT NULL,
    "service" TEXT,
    "reason" TEXT NOT NULL,
    "status" "groom"."BookingStatus" NOT NULL DEFAULT 'pending',
    "meetingId" TEXT,
    "orderId" TEXT,
    "paymentId" TEXT,
    "amount" INTEGER,
    "currency" TEXT DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."blogs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "category" TEXT,
    "imageSeed" TEXT,
    "readTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."confessions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "confessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."testimonials" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groom"."_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "groom"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "groom"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "groom"."user_profiles"("userId");

-- CreateIndex
CREATE INDEX "user_profiles_userId_idx" ON "groom"."user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "groom"."roles"("name");

-- CreateIndex
CREATE INDEX "provider_accounts_userId_idx" ON "groom"."provider_accounts"("userId");

-- CreateIndex
CREATE INDEX "provider_accounts_provider_idx" ON "groom"."provider_accounts"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "provider_accounts_provider_providerUserId_key" ON "groom"."provider_accounts"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionId_key" ON "groom"."sessions"("sessionId");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "groom"."sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_sessionId_idx" ON "groom"."sessions"("sessionId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "groom"."sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "tokens_userId_idx" ON "groom"."tokens"("userId");

-- CreateIndex
CREATE INDEX "tokens_provider_idx" ON "groom"."tokens"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_userId_provider_key" ON "groom"."tokens"("userId", "provider");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "groom"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_event_idx" ON "groom"."audit_logs"("event");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "groom"."audit_logs"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_orderId_key" ON "groom"."bookings"("orderId");

-- CreateIndex
CREATE INDEX "bookings_email_idx" ON "groom"."bookings"("email");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "groom"."bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "groom"."bookings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "groom"."blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_slug_idx" ON "groom"."blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_category_idx" ON "groom"."blogs"("category");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "groom"."_RoleToUser"("B");

-- AddForeignKey
ALTER TABLE "groom"."user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "groom"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groom"."provider_accounts" ADD CONSTRAINT "provider_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "groom"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groom"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "groom"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groom"."tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "groom"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groom"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "groom"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groom"."bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "groom"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groom"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "groom"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groom"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "groom"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
