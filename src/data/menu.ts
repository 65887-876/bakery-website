export type MenuProduct = {
  name: string
  price: number
  details?: string
  note?: string
}

export type MenuCategory = {
  id: string
  title: string
  smallNote?: string
  items: MenuProduct[]
}

export const menuSections: MenuCategory[] = [
  {
    id: 'boissons-chaudes',
    title: 'Boissons chaudes',
    smallNote: 'Servies a la demande',
    items: [
      { name: 'Cafe expresso', price: 120, details: 'Court, serre et bien chaud.' },
      { name: 'Cafe creme', price: 180, details: 'Cafe + lait mousse, style maison.' },
      { name: 'Cappuccino', price: 260, details: 'Mousse epaisse, cacao au dessus.' },
      { name: 'Chocolat chaud', price: 320, details: 'Chocolat lait, texture gourmande.' },
      { name: 'The classique', price: 70, details: 'Verre traditionnel.' },
      { name: 'Infusion', price: 150, details: 'Melange menthe et herbes legeres.' },
      { name: 'Lait au cafe', price: 170, details: 'Doux, sans amertume.' },
    ],
  },
  {
    id: 'frais-et-jus',
    title: 'Frais et jus',
    smallNote: 'Selon disponibilite des fruits',
    items: [
      { name: "Jus d'orange frais", price: 220, details: 'Presse minute.' },
      { name: 'Jus de fraise', price: 320, details: 'Fraise mixee, tres frais.' },
      { name: 'Iced coffee', price: 280, details: 'Cafe froid, legerement sucre.' },
      { name: 'Mojito sans alcool', price: 320, details: 'Menthe, citron, glace pilee.' },
      { name: 'Milkshake vanille', price: 420, details: 'Onctueux et pas trop sucre.' },
      { name: 'Milkshake banane', price: 430, details: 'Banane mixee et creme glacee.' },
      { name: 'Milkshake fraise', price: 430, details: 'Avec chantilly si vous voulez.' },
      { name: 'Milkshake Nutella', price: 460, details: 'Version la plus demandee.' },
    ],
  },
  {
    id: 'san-sebastien',
    title: 'San Sebastian',
    smallNote: 'Notre version du cheesecake basque',
    items: [
      {
        name: 'Part nature',
        price: 330,
        details: 'Cremeux, legerement caramelise.',
      },
      {
        name: 'Part chocolat Mordjene',
        price: 380,
        details: 'Topping genereux et fondant.',
      },
      {
        name: 'Supplement Nutella / Lotus / pistache',
        price: 70,
        details: 'Ajout sur la part.',
        note: 'supplement',
      },
    ],
  },
  {
    id: 'cheesecakes',
    title: 'Cheesecakes',
    items: [
      { name: 'Pistache', price: 430, details: 'Base biscuit + creme pistache.' },
      { name: 'Nutella', price: 430, details: 'Classic de la vitrine.' },
      { name: 'Fraise', price: 390, details: 'Coulis maison quand possible.' },
      { name: 'Noisette', price: 390, details: 'Saveur douce, pas ecoueurante.' },
      { name: 'Chocolat', price: 390, details: 'Pour les amateurs de cacao.' },
      { name: 'Citron', price: 380, details: 'Plus leger, note acidulee.' },
      { name: 'Lotus (base classique)', price: 430, details: 'Creme lotus sur biscuit beurre.' },
      { name: 'Lotus (base lotus)', price: 470, details: 'Double lotus.' },
    ],
  },
  {
    id: 'crepes-crousti',
    title: 'Crepes crousti',
    smallNote: 'Faites minute',
    items: [
      { name: 'Chocolat', price: 320, details: 'Simple et bien garnie.' },
      { name: 'Mordjene', price: 370, details: 'Texture fondante.' },
      { name: 'Nutella', price: 420, details: 'Le grand classique.' },
      { name: 'Pistache', price: 460, details: 'Creme pistache.' },
      {
        name: 'Supplement fruits (banane, fraise, pomme)',
        price: 80,
        note: 'supplement',
      },
    ],
  },
  {
    id: 'viennoiseries',
    title: 'Cookies et cinnamon rolls',
    items: [
      { name: 'Cookie chocolat', price: 170, details: 'Exterieur legerement croustillant.' },
      {
        name: 'Supplement cookie (Nutella / pistache / noisette)',
        price: 70,
        note: 'supplement',
      },
      { name: 'Cinnamon roll chocolat', price: 190, details: 'Mie moelleuse.' },
      { name: 'Cinnamon roll caramel', price: 190, details: 'Caramel beurre sale.' },
      { name: 'Cinnamon roll pistache', price: 230, details: 'Nappage pistache.' },
      { name: 'Cinnamon roll Nutella', price: 230, details: 'Version la plus vendue.' },
    ],
  },
  {
    id: 'vitrine',
    title: 'Desserts vitrine',
    smallNote: 'Disponibilite variable selon la journee',
    items: [
      { name: 'Crunchy cake', price: 520, details: 'Dessert texture croquante/fondante.' },
      { name: 'Despacito', price: 240, details: 'Portion individuelle.' },
      { name: 'Creme brulee', price: 220, details: 'Vanille, sucre caramelise a la main.' },
      { name: 'Mousse au chocolat', price: 220, details: 'Legere et intense.' },
      { name: 'Mini kunafa (jouz)', price: 230, details: 'Aux noix.' },
      { name: 'Cake vanille', price: 170, details: 'Part moelleuse.' },
      { name: 'Cake fraise', price: 220, details: 'Avec creme legere.' },
      { name: 'Tiramisu fraise', price: 320, details: 'Mascarpone + fraise.' },
      { name: 'Tiramisu chocolat', price: 320, details: 'Cacao et biscuit moelleux.' },
      { name: 'Fondant chocolat', price: 330, details: 'Coeur coulant.' },
      { name: 'Brownie', price: 270, details: 'Dense, legerement humide.' },
    ],
  },
]
