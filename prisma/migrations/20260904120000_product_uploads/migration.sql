-- CreateTable
CREATE TABLE "ProductUpload" (
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductUpload_pkey" PRIMARY KEY ("filename")
);
