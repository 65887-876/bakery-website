import type { MenuCategory } from '../../data/menu'

type CategorySelectorProps = {
  categories: MenuCategory[]
  selectedId: string
  onSelectCategory: (categoryId: string) => void
  onEditCategory: (categoryId: string) => void
}

function categoryEmoji(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('cheese') || lower.includes('san sebastian')) return '🍰'
  if (lower.includes('tarte')) return '🥧'
  if (lower.includes('vien')) return '🥐'
  if (lower.includes('gate') || lower.includes('vitrine')) return '🎂'
  if (lower.includes('boisson') || lower.includes('jus') || lower.includes('coffee')) return '🥤'
  return '🧁'
}

export function CategorySelector({
  categories,
  selectedId,
  onSelectCategory,
  onEditCategory,
}: CategorySelectorProps) {
  return (
    <section className="admin-panel">
      <h2>Choisir une categorie</h2>
      <p className="admin-panel__hint">Touchez une carte pour ouvrir les produits.</p>

      <div className="admin-category-grid">
        {categories.map((category) => (
          <article
            key={category.id}
            className={
              category.id === selectedId
                ? 'admin-category-card admin-category-card--active'
                : 'admin-category-card'
            }
          >
            <button type="button" className="admin-category-card__main" onClick={() => onSelectCategory(category.id)}>
              <span className="admin-category-card__icon" aria-hidden="true">
                {categoryEmoji(category.title)}
              </span>
              <span className="admin-category-card__title">{category.title}</span>
              <span className="admin-category-card__count">{category.items.length} produits</span>
            </button>
            <button type="button" className="admin-category-card__edit" onClick={() => onEditCategory(category.id)}>
              Editer
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
