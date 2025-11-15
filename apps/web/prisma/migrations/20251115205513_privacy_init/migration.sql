-- CreateTable
CREATE TABLE "UserConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" DATETIME,
    "ipAddressHash" TEXT,
    "userAgentHash" TEXT
);

-- CreateTable
CREATE TABLE "PrivacyAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT
);

-- CreateTable
CREATE TABLE "EncryptedUserData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "encryptedData" TEXT NOT NULL,
    "encryptionKeyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "UserConsent_userId_idx" ON "UserConsent"("userId");

-- CreateIndex
CREATE INDEX "UserConsent_consentType_idx" ON "UserConsent"("consentType");

-- CreateIndex
CREATE INDEX "PrivacyAuditLog_userId_idx" ON "PrivacyAuditLog"("userId");

-- CreateIndex
CREATE INDEX "PrivacyAuditLog_action_idx" ON "PrivacyAuditLog"("action");

-- CreateIndex
CREATE INDEX "PrivacyAuditLog_timestamp_idx" ON "PrivacyAuditLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "EncryptedUserData_userId_key" ON "EncryptedUserData"("userId");
