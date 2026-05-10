export const shop = {
  name: 'Al Maroua Bakery',
  city: 'Azzaba',
  address: 'Cite AADL 800 logements',
  dailyHours: '11h - 23h',
  phoneDisplay: '0672 83 61 21',
  phoneRaw: '+213672836121',
  whatsappUrl: 'https://wa.me/213665731689',
  menuCurrency: 'DA',
} as const

export const pageTitle = {
  home: 'Al Maroua Bakery - Azzaba',
  menu: 'Menu - Al Maroua Bakery',
} as const

export const shopLinks = {
  tel: `tel:${shop.phoneRaw}`,
} as const
