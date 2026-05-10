import { shop } from '../config/shop'

export function money(value: number): string {
  return `${value.toLocaleString('fr-FR')} ${shop.menuCurrency}`
}
