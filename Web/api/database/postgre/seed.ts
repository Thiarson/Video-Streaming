import path from "node:path"
import { execSync } from "node:child_process"

import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client"

dotenv.config()

if (!process.env.POSTGRE_DATABASE_URL)
  throw new Error("Database URL is undefined")

const DATABASE_URL = process.env.POSTGRE_DATABASE_URL
const databaseUrl = new URL(DATABASE_URL)

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl.toString(),
    },
  },
});

try {
  const src = path.dirname(__dirname)
  const root = path.dirname(src)

  execSync(`npx prisma migrate dev --schema=../prisma/schema.prisma --name create_table`, {
    stdio: 'inherit',
    cwd: root,
  })

  console.log('Migration exécutée avec succès !');
} catch (e) {
  console.error("Erreur lord de l'exécution de la migration : ", e);
}

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)

// const userId = {
//   thiarson: `${uuidv4()}_Thiarson_${new Date().getTime()}`,
//   lova: `${uuidv4()}_Lova_${new Date().getTime()}`,
// }

const userId = {
  thiarson: `Thiarson`,
  lova: `Lova`,
}

const userData = [
  {
    userId: userId.thiarson,
    userPseudo : "Thiarson",
    userBirthDate : new Date("2002-07-08"),
    userSex : "M",
    userPhone : "0346302300",
    userEmail : "thiarsonantsa@gmail.com",
    userBio : "Créateur de la plateforme !",
    userWallet : "100000",
    userPassword : bcrypt.hashSync("fanantenana", salt),
    userPhoto : "/data/Thiarson/profile/photo.jpg",
  },
  {
    userId: userId.lova,
    userPseudo : "Lova",
    userBirthDate : new Date("2001-09-08"),
    userSex : "L",
    userPhone : "0341984816",
    userEmail : "lovaandria@gmail.com",
    userPassword : bcrypt.hashSync("andrialova", salt),
  },
]

// const videoId = {
//   vadiko: `${uuidv4()}_Vadiko_${new Date().getTime()}`,
//   kirikou: `${uuidv4()}_Kirikou_${new Date().getTime()}`,
//   jalouxine: `${uuidv4()}_Jalouxine_${new Date().getTime()}`,
// }

const videoId = {
  vadiko: `Vadiko`,
  kirikou: `Kirikou`,
  jalouxine: `Jalouxine`,
  introduction: `Introduction`,
  paiso: `Paiso`,
}

const videoData = [
  {
    videoId: videoId.vadiko,
    videoTitle : "Vadiko",
    videoDescription : "Une chanson de Rim-Ka qui parle de son amour pour une fille",
    videoCategory : "Musique",
    videoPrice : "2000",
    videoThumbnail : `/data/${userId.thiarson}/videos/${videoId.vadiko}/${videoId.vadiko}.jpg`,
    videoUrl : `/streams/${userId.thiarson}/videos/${videoId.vadiko}/index.m3u8`,
    videoDuration: "00:15:00",
    userId : userId.thiarson,
    isValid : true,
  },
  {
    videoId: videoId.introduction,
    videoTitle : "Tuto Guitare - Intro",
    videoDescription : "Introduction sur la série de tutoriel en Guitare. Il y a trois niveaux dans ce tutoriel : Débutant, Moyen et Avancé. Ce tutoriel est ouvert à tous ceux qui veulent apprendre à jouer du guitare. La plupart des vidéos sont payants, mais il y aura des tutoriels gratuits !",
    videoCategory : "Musique",
    videoPrice : "0",
    videoThumbnail : `/data/${userId.thiarson}/videos/${videoId.introduction}/${videoId.introduction}.jpg`,
    videoUrl : `/streams/${userId.thiarson}/videos/${videoId.introduction}/index.m3u8`,
    videoDuration: "00:15:00",
    videoPlaylist: "Guitare",
    userId : userId.thiarson,
    isValid : true,
  },
  {
    videoId: videoId.paiso,
    videoTitle : "Paiso Ra-kena",
    videoDescription : "Le premier tutoriel dans cette série de vidéo est la chanson du groupe Mahaleo qui s'intitule Paiso Ra-kena. Cette vidéo démontre les méthodes utilisées dans ce tutoriel.",
    videoCategory : "Musique",
    videoPrice : "200",
    videoThumbnail : `/data/${userId.thiarson}/videos/${videoId.paiso}/${videoId.paiso}.jpg`,
    videoUrl : `/streams/${userId.thiarson}/videos/${videoId.paiso}/index.m3u8`,
    videoDuration: "00:15:00",
    videoPlaylist: "Guitare",
    userId : userId.thiarson,
    isValid : true,
  },
  {
    videoId: videoId.kirikou,
    videoTitle : "Kirikou",
    videoDescription : "Ceis a écrit une chanson pour une fille maltraitée par son copain",
    videoCategory : "Musique",
    videoPrice : "0",
    videoThumbnail : `/data/${userId.lova}/videos/${videoId.kirikou}/${videoId.kirikou}.jpg`,
    videoUrl : `/streams/${userId.lova}/videos/${videoId.kirikou}/index.m3u8`,
    videoDuration: "00:15:00",
    userId: userId.lova,
    isValid : true,
  },
  {
    videoId: videoId.jalouxine,
    videoTitle : "Jalouxine",
    videoDescription : "La nouvelle chanson de Tence Mena qui parle de la jalousie",
    videoCategory : "Musique",
    videoPrice : "1500",
    videoThumbnail : `/data/${userId.lova}/videos/${videoId.jalouxine}/${videoId.jalouxine}.jpg`,
    videoUrl : `/streams/${userId.lova}/videos/${videoId.jalouxine}/index.m3u8`,
    videoDuration: "00:15:00",
    userId: userId.lova,
    isValid : true,
  },
]

const directId = {
  mahaleo: `Mahaleo`,
  php: `PHP`,
  vendeur: `Vendeur`,
  leader: `Leader`,
}

const directData = [
  {
    directId: directId.mahaleo,
    directTitle : "Revy Feu de camp",
    directDescription : "Un concert nocture autour d'un feu de camp avec le groupe Mahaleo",
    directPrice : "5000",
    directThumbnail : `/data/${userId.lova}/direct/${directId.mahaleo}/${directId.mahaleo}.jpg`,
    directUrl : `/streams/${userId.lova}/direct/${directId.mahaleo}/index.m3u8`,
    directDate : new Date("2025-02-12T20:30:00"),
    directDuration : "00:45:00",
    userId : userId.lova,
    isValid : true,
  },
  {
    directId: directId.php,
    directTitle : "PHP Conference",
    directDescription : "Une conférence pour les passionnés sur le langage de programmation PHP",
    directPrice : "0",
    directThumbnail : `/data/${userId.lova}/direct/${directId.php}/${directId.php}.jpg`,
    directUrl : `/streams/${userId.lova}/direct/${directId.php}/index.m3u8`,
    directDate : new Date("2023-10-28T20:30:00"),
    directDuration : "01:00:00",
    directKey : "stream",
    userId : userId.lova,
    isValid : true,
  },
  {
    directId: directId.vendeur,
    directTitle : "Devenir vendeur d'élite",
    directDescription : "Une formation proposée par l'entrepreneur Mianatra Mahomby à propos de vente",
    directPrice : "10000",
    directThumbnail : `/data/${userId.thiarson}/direct/${directId.vendeur}/${directId.vendeur}.jpg`,
    directUrl : `/streams/${userId.thiarson}/direct/${directId.vendeur}/index.m3u8`,
    directDate : new Date("2025-02-12T20:30:00"),
    directDuration : "02:00:00",
    userId : userId.thiarson,
    isValid : true,
  },
  {
    directId: directId.leader,
    directTitle : "Devenir leader et chef d'entreprise",
    directDescription : "Une formation sur le leadership proposée par plusieurs entrepreneur",
    directPrice : "9500",
    directThumbnail : `/data/${userId.lova}/direct/${directId.leader}/${directId.leader}.jpg`,
    directUrl : `/streams/${userId.lova}/direct/${directId.leader}/index.m3u8`,
    directDate : new Date("2024-10-02T17:00:00"),
    directDuration : "01:00:00",
    directInProgress: false,
    userId : userId.lova,
    isValid : true,
  },
]

const rediffusionData = [
  {
    rediffusionId : directId.leader,
    rediffusionUrl : `/streams/${userId.lova}/videos/${directId.leader}/index.m3u8`,
  },
]

const playlistData = [
  {
    userId: userId.thiarson,
    playlistTitle: "Guitare",
    playlistDescription: "Tutoriel de guitare",
    videoCount: 2,
  },
]

async function main() {
  console.log(`Start seeding ...`);

  for (const data of userData) {
    const user = await prisma.userInfo.create({
      data: data,
    });
    console.log(`Created user with pseudo: ${user.userPseudo}`);
  }

  for (const data of videoData) {
    const video = await prisma.videoContent.create({
      data: data,
    });
    console.log(`Created video with title: ${video.videoTitle}`);
  }

  for (const data of directData) {
    const direct = await prisma.directContent.create({
      data: data,
    });
    console.log(`Created direct with title: ${direct.directTitle}`);
  }

  for (const data of rediffusionData) {
    const rediffusion = await prisma.rediffusionContent.create({
      data: data,
    });
    console.log(`Created rediffusion with id: ${rediffusion.rediffusionId}`);
  }

  for (const data of playlistData) {
    const playlist = await prisma.videoPlaylist.create({
      data: data,
    });
    console.log(`Created playlist with title: ${playlist.playlistTitle}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
