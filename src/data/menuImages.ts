const fallbackShots = ['/photos/photo-26.png', '/photos/photo-08.png', '/photos/photo-14.png'] as const

export const homeHeroImage = '/photos/photo-15.png'
export const menuHeroImage = '/photos/photo-24.png'

export const homeHighlights = [
  '/photos/photo-26.png',
  '/photos/photo-15.png',
  '/photos/photo-20.png',
  '/photos/photo-08.png',
] as const

const categoryShots: Record<string, string> = {
  'boissons-chaudes': '/photos/photo-21.png',
  'frais-et-jus': '/photos/photo-20.png',
  'san-sebastien': '/photos/photo-15.png',
  cheesecakes: '/photos/photo-26.png',
  'crepes-crousti': '/photos/photo-12.png',
  viennoiseries: '/photos/photo-04.png',
  vitrine: '/photos/photo-06.png',
}

const sectionGalleries: Record<string, string[]> = {
  'boissons-chaudes': [
    '/photos/photo-21.png',
    '/photos/photo-25.png',
    '/photos/photo-27.png',
    '/photos/photo-28.png',
    '/photos/photo-10.png',
  ],
  'frais-et-jus': [
    '/photos/photo-02.png',
    '/photos/photo-03.png',
    '/photos/photo-20.png',
    '/photos/photo-21.png',
    '/photos/photo-23.png',
    '/photos/photo-29.png',
    '/photos/photo-30.png',
    '/photos/photo-25.png',
    '/photos/photo-27.png',
    '/photos/photo-19.png',
  ],
  'san-sebastien': [
    '/photos/photo-05.png',
    '/photos/photo-15.png',
    '/photos/photo-17.png',
    '/photos/photo-11.png',
  ],
  cheesecakes: [
    '/photos/photo-01.png',
    '/photos/photo-05.png',
    '/photos/photo-08.png',
    '/photos/photo-14.png',
    '/photos/photo-15.png',
    '/photos/photo-16.png',
    '/photos/photo-18.png',
    '/photos/photo-24.png',
    '/photos/photo-26.png',
  ],
  'crepes-crousti': [
    '/photos/photo-12.png',
    '/photos/photo-11.png',
    '/photos/photo-04.png',
    '/photos/photo-06.png',
    '/photos/photo-26.png',
  ],
  viennoiseries: [
    '/photos/photo-04.png',
    '/photos/photo-09.png',
    '/photos/photo-10.png',
    '/photos/photo-07.png',
    '/photos/photo-12.png',
    '/photos/photo-28.png',
  ],
  vitrine: [
    '/photos/photo-06.png',
    '/photos/photo-07.png',
    '/photos/photo-08.png',
    '/photos/photo-09.png',
    '/photos/photo-12.png',
    '/photos/photo-14.png',
    '/photos/photo-18.png',
    '/photos/photo-16.png',
    '/photos/photo-26.png',
  ],
}

const byItemName: Record<string, Record<string, string>> = {
  'boissons-chaudes': {
    'cafe expresso': '/photos/photo-28.png',
    'cafe creme': '/photos/photo-21.png',
    cappuccino: '/photos/photo-25.png',
    'chocolat chaud': '/photos/photo-10.png',
    'the classique': '/photos/photo-29.png',
    infusion: '/photos/photo-03.png',
    'lait au cafe': '/photos/photo-30.png',
  },
  'frais-et-jus': {
    "jus d'orange frais": '/photos/photo-02.png',
    'jus de fraise': '/photos/photo-23.png',
    'iced coffee': '/photos/photo-21.png',
    'mojito sans alcool': '/photos/photo-20.png',
    'milkshake vanille': '/photos/photo-25.png',
    'milkshake banane': '/photos/photo-30.png',
    'milkshake fraise': '/photos/photo-27.png',
    'milkshake nutella': '/photos/photo-10.png',
  },
  'san-sebastien': {
    'part nature': '/photos/photo-05.png',
    'part chocolat mordjene': '/photos/photo-17.png',
    'supplement nutella / lotus / pistache': '/photos/photo-14.png',
  },
  cheesecakes: {
    pistache: '/photos/photo-24.png',
    nutella: '/photos/photo-17.png',
    fraise: '/photos/photo-07.png',
    noisette: '/photos/photo-09.png',
    chocolat: '/photos/photo-01.png',
    citron: '/photos/photo-05.png',
    'lotus (base classique)': '/photos/photo-14.png',
    'lotus (base lotus)': '/photos/photo-18.png',
  },
  'crepes-crousti': {
    chocolat: '/photos/photo-11.png',
    mordjene: '/photos/photo-12.png',
    nutella: '/photos/photo-04.png',
    pistache: '/photos/photo-18.png',
    'supplement fruits (banane, fraise, pomme)': '/photos/photo-23.png',
  },
  viennoiseries: {
    'cookie chocolat': '/photos/photo-04.png',
    'supplement cookie (nutella / pistache / noisette)': '/photos/photo-14.png',
    'cinnamon roll chocolat': '/photos/photo-10.png',
    'cinnamon roll caramel': '/photos/photo-14.png',
    'cinnamon roll pistache': '/photos/photo-16.png',
    'cinnamon roll nutella': '/photos/photo-28.png',
  },
  vitrine: {
    'crunchy cake': '/photos/photo-04.png',
    despacito: '/photos/photo-09.png',
    'creme brulee': '/photos/photo-05.png',
    'mousse au chocolat': '/photos/photo-01.png',
    'mini kunafa (jouz)': '/photos/photo-13.png',
    'cake vanille': '/photos/photo-04.png',
    'cake fraise': '/photos/photo-07.png',
    'tiramisu fraise': '/photos/photo-07.png',
    'tiramisu chocolat': '/photos/photo-01.png',
    'fondant chocolat': '/photos/photo-11.png',
    brownie: '/photos/photo-12.png',
  },
}

function cleanName(value: string): string {
  return value.trim().toLowerCase()
}

export function categoryPhoto(sectionId: string): string {
  return categoryShots[sectionId] ?? fallbackShots[0]
}

export function itemPhoto(sectionId: string, itemIndex: number, itemName?: string): string {
  if (itemName) {
    const exactMatch = byItemName[sectionId]?.[cleanName(itemName)]
    if (exactMatch) return exactMatch
  }

  const gallery = sectionGalleries[sectionId] ?? fallbackShots
  return gallery[itemIndex % gallery.length]
}
