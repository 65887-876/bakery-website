export type MenuProduct = {
  name: string
  price: number
  details?: string
  note?: string
  image?: string
}

export type MenuCategory = {
  id: string
  title: string
  smallNote?: string
  coverImage?: string
  items: MenuProduct[]
}

const rawMenuSections: MenuCategory[] = [
  {
    id: 'boissons-chaudes',
    title: 'Boissons chaudes',
    smallNote: 'Servies a la demande',
    items: [
      { name: 'Cafe expresso', price: 120, details: 'Court, serre et bien chaud.' },
      { name: 'Cafe caps', price: 150, details: 'Version cremeuse, style maison.' },
      { name: 'The infusion', price: 150, details: 'Melange menthe et herbes legeres.' },
      { name: 'The', price: 50, details: 'Verre traditionnel.' },
      { name: 'Cappuccino', price: 250, details: 'Mousse epaisse, cacao au dessus.' },
      { name: 'Chocolat chaud', price: 300, details: 'Chocolat lait, texture gourmande.' },
      { name: 'Lait au cafe', price: 170, details: 'Doux, sans amertume.' },
      { name: 'Lait au chocolat', price: 150, details: 'Lait chaud et chocolat leger.' },
    ],
  },
  {
    id: 'boissons-froides',
    title: 'Boissons froides',
    smallNote: 'Frais et jus',
    items: [
      { name: 'Iced coffee', price: 250, details: 'Cafe froid, legerement sucre.' },
      { name: 'Mojito sans alcool', price: 320, details: 'Menthe, citron, glace pilee.' },
      { name: 'Milkshake banane', price: 400, details: 'Banane mixee et creme glacee.' },
      { name: 'Milkshake vanille', price: 400, details: 'Onctueux et pas trop sucre.' },
      { name: 'Milkshake fraise', price: 400, details: 'Avec chantilly si vous voulez.' },
      { name: 'Milkshake nutella', price: 400, details: 'Version la plus demandee.' },
      {
        name: 'Milkshake caramel beurre sale',
        price: 400,
        details: 'Caramel doux, note salee.',
      },
      { name: "Jus d'orange", price: 200, details: 'Presse minute.' },
      { name: 'Jus de fraises', price: 300, details: 'Fraise mixee, tres frais.' },
    ],
  },
  {
    id: 'san-sebastien',
    title: 'San Sebastian',
    smallNote: 'Notre version du cheesecake basque',
    items: [
      {
        name: 'Part nature',
        price: 350,
        details: 'Cremeux, legerement caramelise.',
      },
      {
        name: 'Part chocolat Mordjene',
        price: 380,
        details: 'Topping genereux et fondant.',
      },
      {
        name: 'Supplement Nutella / Lotus / pistache',
        price: 50,
        details: 'Ajout sur la part.',
        note: 'supplement',
      },
    ],
  },
  {
    id: 'cheesecakes',
    title: 'Cheesecakes',
    items: [
      { name: 'Pistache', price: 400, details: 'Base biscuit + creme pistache.' },
      { name: 'Nutella', price: 400, details: 'Classic de la vitrine.' },
      { name: 'Noisette', price: 350, details: 'Saveur douce, pas ecoueurante.' },
      { name: 'Fraises', price: 350, details: 'Coulis maison quand possible.' },
      { name: 'Citron', price: 350, details: 'Plus leger, note acidulee.' },
      { name: 'Chocolat', price: 350, details: 'Pour les amateurs de cacao.' },
      { name: 'Lotus (biscuit normal)', price: 400, details: 'Creme lotus sur biscuit beurre.' },
      { name: 'Lotus (biscuit lotus)', price: 450, details: 'Double lotus.' },
    ],
  },
  {
    id: 'crepes-crousti',
    title: 'Crepes crousti',
    smallNote: 'Faites minute',
    items: [
      { name: 'Chocolat simple', price: 300, details: 'Simple et bien garnie.' },
      { name: 'Mordjene', price: 370, details: 'Texture fondante.' },
      { name: 'Nutella', price: 400, details: 'Le grand classique.' },
      { name: 'Pistache', price: 450, details: 'Creme pistache.' },
      {
        name: 'Supplement fruits (banane, fraises, pomme)',
        price: 50,
        note: 'supplement',
      },
    ],
  },
  {
    id: 'viennoiseries',
    title: 'Cookies et cinnamon rolls',
    items: [
      { name: 'Cookie chocolat', price: 150, details: 'Exterieur legerement croustillant.' },
      {
        name: 'Supplement (nutella, pistache, Mordjene, noisette)',
        price: 50,
        note: 'supplement',
      },
      { name: 'Cinnamon roll chocolat', price: 150, details: 'Mie moelleuse.' },
      { name: 'Cinnamon roll caramel', price: 150, details: 'Caramel beurre sale.' },
      { name: 'Cinnamon roll pistache', price: 200, details: 'Nappage pistache.' },
      { name: 'Cinnamon roll Nutella', price: 200, details: 'Version la plus vendue.' },
    ],
  },
  {
    id: 'vitrine',
    title: 'Desserts vitrine',
    smallNote: 'Disponibilite variable selon la journee',
    items: [
      { name: 'Crunchy cake', price: 500, details: 'Dessert texture croquante/fondante.' },
      { name: 'Despacito', price: 200, details: 'Portion individuelle.' },
      { name: 'Creme brulee', price: 200, details: 'Vanille, sucre caramelise a la main.' },
      { name: 'Mousse au chocolat', price: 200, details: 'Legere et intense.' },
      { name: 'Mini kunafa (jouz)', price: 200, details: 'Aux noix.' },
      { name: 'Cake vanille', price: 150, details: 'Part moelleuse.' },
      { name: 'Cake fraises', price: 200, details: 'Avec creme legere.' },
      { name: 'Tiramisu fraises', price: 300, details: 'Mascarpone + fraise.' },
      { name: 'Tiramisu chocolat', price: 300, details: 'Cacao et biscuit moelleux.' },
      { name: 'Fondant au chocolat', price: 300, details: 'Coeur coulant.' },
      { name: 'Brownies', price: 250, details: 'Dense, legerement humide.' },
    ],
  },
]

function prioritizeCheesecakes(sections: MenuCategory[]): MenuCategory[] {
  const list = [...sections]
  const idx = list.findIndex((section) => section.id === 'cheesecakes')
  if (idx > 0) {
    const [cheesecakes] = list.splice(idx, 1)
    list.unshift(cheesecakes)
  }
  return list
}

export const defaultMenuSections = prioritizeCheesecakes(rawMenuSections)
export const menuSections = defaultMenuSections
