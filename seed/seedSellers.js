require("../db/index");
const Seller = require("./../models/Seller.model");

const sellers = [
  {
    firstName: 'Marcus',
    lastName: 'Dawson',
    email: 'mubecuh@eza.sv',
    affliation: 'Kellogg Company',
    passwordHash: '$2b$10$x/0hIseLcqkMyBdgiTnhk..oLPYDWK64hSOS1sBCJxzYbh4nmPGFa'
  },
  {
    firstName: 'Carrie',
    lastName: 'Kelly',
    email: 'po@pa.kz',
    affliation: 'Abbott Laboratories',
    passwordHash: '$2b$10$GhiOb/AhuqA0XssyvCguh.6aTzfNkULZvGQLdVJd28eekqFCSpBku'
  },
  {
    firstName: 'Duane',
    lastName: 'Potter',
    email: 'lipa@oj.cr',
    affliation: 'RGS Energy Group Inc',
    passwordHash: '$2b$10$fxFlU60LAmiQAjnCJaSna.mJO/Jj1vU6ip.BBHVoIMLq40j.7hzqm'
  },
  {
    firstName: 'Victor',
    lastName: 'Bush',
    email: 'okanij@jeucu.ro',
    affliation: 'Sierra Pacific Resources',
    passwordHash: '$2b$10$bFo7tmz6Z7jb79MNQhZjDeFWZTErJcby6umXRVTwoy1RJId8rv32C'
  },
  {
    firstName: 'Irene',
    lastName: 'Middleton',
    email: 'gelzedmim@lipuz.ac',
    affliation: 'Pride International Inc',
    passwordHash: '$2b$10$W5zoAm3W49xMMnl21Za94u3ZV4bPIQcmFV5YctE0GKbUvR4H6GvTK'
  },
  {
    firstName: 'Josephine',
    lastName: 'Francis',
    email: 'femashil@muvdihug.io',
    affliation: 'Perini Corp',
    passwordHash: '$2b$10$Y3aWsx70xTxp61rvCzgAf.MiKDRv0jVFjdNd.CWeDjeLtChhxlim6'
  },
  {
    firstName: 'Emilie',
    lastName: 'Hirano',
    email: 'zirkaza@rolza.bo',
    affliation: 'Cabot Corp',
    passwordHash: '$2b$10$E4rSG0kfUUzCy/mGNUxPfusGFr/4U6OfpKlrsvimtVBLElrsuAyHG'
  },
  {
    firstName: 'Jayden',
    lastName: 'Wolfe',
    email: 'dusnocse@ewdu.io',
    affliation: 'Wells Fargo & Company',
    passwordHash: '$2b$10$wJUjqh4AIAsPEI.1ucxSU.yCwjpTbAtYF5sQ.NVXesiW39WR5XyKy'
  },
  {
    firstName: 'Glen',
    lastName: 'Giovannelli',
    email: 'zenu@pigoum.ir',
    affliation: 'E.W. Scripps Company',
    passwordHash: '$2b$10$vW5V1Tj97aZzcjBlP0pKW.Ozi71p9YUeT4Uc.viZLARtxJwfr2EGC'
  },
  {
    firstName: 'Dean',
    lastName: 'Vasseur',
    email: 'camcet@remsave.rs',
    affliation: 'Penn Traffic Co.',
    passwordHash: '$2b$10$vGey07MspR1.liePBxyWmOxzoKcGSwy2YT5NmbEkbpt5SOpRwmJsa'
  }
]

Seller.create(sellers).then(dbSellers => console.log("sellers in db: ", sellers));




