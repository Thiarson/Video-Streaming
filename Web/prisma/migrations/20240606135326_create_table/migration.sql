-- CreateTable
CREATE TABLE "UserInfo" (
    "userId" VARCHAR NOT NULL,
    "userPseudo" VARCHAR NOT NULL,
    "userBirthDate" DATE NOT NULL,
    "userSex" CHAR NOT NULL,
    "userPhone" VARCHAR NOT NULL,
    "userEmail" VARCHAR NOT NULL,
    "userBio" VARCHAR,
    "userWallet" VARCHAR NOT NULL DEFAULT '0',
    "userPassword" VARCHAR NOT NULL,
    "userRegistrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userPhoto" VARCHAR NOT NULL DEFAULT '/data/default/profile/photo.jpg',

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "VideoContent" (
    "videoId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "videoTitle" VARCHAR NOT NULL,
    "videoDescription" TEXT NOT NULL,
    "videoCategory" VARCHAR NOT NULL,
    "videoPrice" VARCHAR NOT NULL,
    "videoThumbnail" VARCHAR NOT NULL,
    "videoUrl" VARCHAR NOT NULL,
    "videoPublicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoDuration" VARCHAR NOT NULL,
    "videoPlaylist" VARCHAR,
    "isValid" BOOLEAN,

    CONSTRAINT "VideoContent_pkey" PRIMARY KEY ("videoId")
);

-- CreateTable
CREATE TABLE "DirectContent" (
    "directId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "directTitle" VARCHAR NOT NULL,
    "directDescription" TEXT NOT NULL,
    "directThumbnail" VARCHAR NOT NULL,
    "directUrl" VARCHAR NOT NULL,
    "directDate" TIMESTAMP(3) NOT NULL,
    "directDuration" VARCHAR NOT NULL,
    "directPrice" VARCHAR NOT NULL,
    "directInProgress" BOOLEAN,
    "directKey" VARCHAR,
    "isValid" BOOLEAN,

    CONSTRAINT "DirectContent_pkey" PRIMARY KEY ("directId")
);

-- CreateTable
CREATE TABLE "RediffusionContent" (
    "rediffusionId" VARCHAR NOT NULL,
    "rediffusionUrl" VARCHAR NOT NULL,

    CONSTRAINT "RediffusionContent_pkey" PRIMARY KEY ("rediffusionId")
);

-- CreateTable
CREATE TABLE "VideoPlaylist" (
    "userId" VARCHAR NOT NULL,
    "playlistTitle" VARCHAR NOT NULL,
    "playlistDescription" TEXT NOT NULL,
    "videoCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VideoPlaylist_pkey" PRIMARY KEY ("playlistTitle")
);

-- CreateTable
CREATE TABLE "VideoCheck" (
    "videoId" VARCHAR NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VideoCheck_pkey" PRIMARY KEY ("videoId")
);

-- CreateTable
CREATE TABLE "DirectCheck" (
    "directId" VARCHAR NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DirectCheck_pkey" PRIMARY KEY ("directId")
);

-- CreateTable
CREATE TABLE "BuyVideo" (
    "buyVideoId" SERIAL NOT NULL,
    "videoId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuyVideo_pkey" PRIMARY KEY ("buyVideoId")
);

-- CreateTable
CREATE TABLE "AssistDirect" (
    "assistDirectId" SERIAL NOT NULL,
    "directId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistDirect_pkey" PRIMARY KEY ("assistDirectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userId_key" ON "UserInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userPhone_key" ON "UserInfo"("userPhone");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userEmail_key" ON "UserInfo"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "VideoContent_videoId_key" ON "VideoContent"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoContent_videoUrl_key" ON "VideoContent"("videoUrl");

-- CreateIndex
CREATE UNIQUE INDEX "DirectContent_directId_key" ON "DirectContent"("directId");

-- CreateIndex
CREATE UNIQUE INDEX "DirectContent_directUrl_key" ON "DirectContent"("directUrl");

-- CreateIndex
CREATE UNIQUE INDEX "DirectContent_directKey_key" ON "DirectContent"("directKey");

-- CreateIndex
CREATE UNIQUE INDEX "RediffusionContent_rediffusionId_key" ON "RediffusionContent"("rediffusionId");

-- CreateIndex
CREATE UNIQUE INDEX "RediffusionContent_rediffusionUrl_key" ON "RediffusionContent"("rediffusionUrl");

-- CreateIndex
CREATE UNIQUE INDEX "VideoPlaylist_playlistTitle_key" ON "VideoPlaylist"("playlistTitle");

-- CreateIndex
CREATE UNIQUE INDEX "VideoCheck_videoId_key" ON "VideoCheck"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "DirectCheck_directId_key" ON "DirectCheck"("directId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyVideo_buyVideoId_key" ON "BuyVideo"("buyVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "AssistDirect_assistDirectId_key" ON "AssistDirect"("assistDirectId");

-- AddForeignKey
ALTER TABLE "VideoContent" ADD CONSTRAINT "VideoContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectContent" ADD CONSTRAINT "DirectContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RediffusionContent" ADD CONSTRAINT "RediffusionContent_rediffusionId_fkey" FOREIGN KEY ("rediffusionId") REFERENCES "DirectContent"("directId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoPlaylist" ADD CONSTRAINT "VideoPlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCheck" ADD CONSTRAINT "VideoCheck_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "VideoContent"("videoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectCheck" ADD CONSTRAINT "DirectCheck_directId_fkey" FOREIGN KEY ("directId") REFERENCES "DirectContent"("directId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyVideo" ADD CONSTRAINT "BuyVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "VideoContent"("videoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyVideo" ADD CONSTRAINT "BuyVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistDirect" ADD CONSTRAINT "AssistDirect_directId_fkey" FOREIGN KEY ("directId") REFERENCES "DirectContent"("directId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistDirect" ADD CONSTRAINT "AssistDirect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserInfo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
