-- CreateTable
CREATE TABLE "DAOProposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "DAOProposal_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "DAOProposal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EncryptedUserData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "encryptedData" TEXT NOT NULL,
    "encryptionKeyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EncryptedUserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EncryptedUserData" ("createdAt", "encryptedData", "encryptionKeyId", "id", "updatedAt", "userId") SELECT "createdAt", "encryptedData", "encryptionKeyId", "id", "updatedAt", "userId" FROM "EncryptedUserData";
DROP TABLE "EncryptedUserData";
ALTER TABLE "new_EncryptedUserData" RENAME TO "EncryptedUserData";
CREATE UNIQUE INDEX "EncryptedUserData_userId_key" ON "EncryptedUserData"("userId");
CREATE TABLE "new_PrivacyAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    CONSTRAINT "PrivacyAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PrivacyAuditLog" ("action", "details", "id", "ipHash", "timestamp", "userId") SELECT "action", "details", "id", "ipHash", "timestamp", "userId" FROM "PrivacyAuditLog";
DROP TABLE "PrivacyAuditLog";
ALTER TABLE "new_PrivacyAuditLog" RENAME TO "PrivacyAuditLog";
CREATE INDEX "PrivacyAuditLog_userId_idx" ON "PrivacyAuditLog"("userId");
CREATE INDEX "PrivacyAuditLog_action_idx" ON "PrivacyAuditLog"("action");
CREATE INDEX "PrivacyAuditLog_timestamp_idx" ON "PrivacyAuditLog"("timestamp");
CREATE TABLE "new_UserConsent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "grantedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" DATETIME,
    "ipAddressHash" TEXT,
    "userAgentHash" TEXT,
    CONSTRAINT "UserConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserConsent" ("consentType", "granted", "grantedAt", "id", "ipAddressHash", "userAgentHash", "userId", "withdrawnAt") SELECT "consentType", "granted", "grantedAt", "id", "ipAddressHash", "userAgentHash", "userId", "withdrawnAt" FROM "UserConsent";
DROP TABLE "UserConsent";
ALTER TABLE "new_UserConsent" RENAME TO "UserConsent";
CREATE INDEX "UserConsent_userId_idx" ON "UserConsent"("userId");
CREATE INDEX "UserConsent_consentType_idx" ON "UserConsent"("consentType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
