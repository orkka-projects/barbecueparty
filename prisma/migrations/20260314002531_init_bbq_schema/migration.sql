-- CreateTable
CREATE TABLE "BarbecueEvent" (
    "id" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarbecueEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bbqId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarbecueEvent_inviteCode_key" ON "BarbecueEvent"("inviteCode");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_bbqId_fkey" FOREIGN KEY ("bbqId") REFERENCES "BarbecueEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
