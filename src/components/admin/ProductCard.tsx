import type { MenuProduct } from '../../data/menu'
import { itemPhoto } from '../../data/menuImages'

type ProductCardProps = {
  categoryId: string
  index: number
  product: MenuProduct
  onEdit: () => void
  onDelete: () => void
}

export function ProductCard({ categoryId, index, product, onEdit, onDelete }: ProductCardProps) {
  return (
    <article className="admin-product-card">
      <img
        src={itemPhoto(categoryId, index, product.name, product.image)}
        alt={product.name}
        loading="lazy"
        width={128}
        height={96}
      />
      <div className="admin-product-card__body">
        <h3>{product.name || 'Sans nom'}</h3>
        <p className="admin-product-card__price">{Number(product.price || 0)} DA</p>
        <p className="admin-product-card__desc">{product.details || 'Aucune description'}</p>
        <div className="admin-product-card__actions">
          <button type="button" onClick={onEdit}>
            Modifier
          </button>
          <button type="button" className="danger" onClick={onDelete}>
            Supprimer
          </button>
        </div>
      </div>
    </article>
  )
}
