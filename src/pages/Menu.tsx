import { useEffect, useMemo } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { itemPhoto, menuHeroImage } from '../data/menuImages'
import { pageTitle, shop, shopLinks } from '../config/shop'
import { useMenuData } from '../data/menuStore'
import { money } from '../utils/money'
import './Menu.css'

export function Menu() {
  const sections = useMenuData()
  const { categoryId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = pageTitle.menu
    return () => {
      document.title = pageTitle.home
    }
  }, [])

  const selectedCategory = useMemo(() => {
    if (!sections.length) return null
    const requested = sections.find((section) => section.id === categoryId)
    return requested ?? sections[0]
  }, [sections, categoryId])

  useEffect(() => {
    if (!sections.length) return
    if (!categoryId || !sections.some((section) => section.id === categoryId)) {
      navigate(`/menu/${sections[0].id}`, { replace: true })
    }
  }, [sections, categoryId, navigate])

  function buildOrderLink(itemName: string, price: number): string {
    const text = encodeURIComponent(
      `Bonjour, je souhaite commander "${itemName}" (${money(price)}).`,
    )
    return `${shop.whatsappUrl}?text=${text}`
  }

  return (
    <div className="menu-page">
      <header className="menu-hero">
        <div className="menu-hero__img-wrap" aria-hidden="true">
          <img src={menuHeroImage} alt="" className="menu-hero__img" />
        </div>
        <div className="menu-hero__text">
          <p className="menu-hero__eyebrow">Carte du jour</p>
          <h1>{shop.name}</h1>
          <p>
            {shop.city} - {shop.address}
          </p>
        </div>
      </header>

      <section className="cat-strip" aria-label="Categories du menu">
        <div className="cat-strip__scroll">
          {sections.map((section) => (
            <NavLink
              key={section.id}
              to={`/menu/${section.id}`}
              className={({ isActive }) =>
                isActive ? 'cat-chip cat-chip--active' : 'cat-chip'
              }
            >
              {section.title}
            </NavLink>
          ))}
        </div>
      </section>

      {!selectedCategory && <p className="menu-empty">Aucune categorie disponible.</p>}
      {selectedCategory && (
        <section className="menu-block" aria-labelledby={`cat-${selectedCategory.id}`}>
          <div className="menu-block__head">
            <h2 id={`cat-${selectedCategory.id}`} className="menu-block__title">
              {selectedCategory.title}
            </h2>
            {selectedCategory.smallNote && (
              <p className="menu-block__subtitle">{selectedCategory.smallNote}</p>
            )}
          </div>

          <div className="menu-block__grid">
            {selectedCategory.items.map((item, i) => (
              <article key={`${item.name}-${i}`} className="product-card">
                <div className="product-card__media">
                  <img
                    src={itemPhoto(selectedCategory.id, i, item.name, item.image)}
                    alt={item.name}
                    loading="lazy"
                    width={800}
                    height={500}
                  />
                </div>
                <div className="product-card__body">
                  <div className="product-card__header">
                    <h3 className="product-card__name">{item.name}</h3>
                    <p className="product-card__price">{money(item.price)}</p>
                  </div>
                  {item.details && (
                    <p className="product-card__desc">{item.details}</p>
                  )}
                  {item.note && (
                    <p className="product-card__note">{item.note}</p>
                  )}
                  <a
                    href={buildOrderLink(item.name, item.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-card__cta"
                  >
                    Commander
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <p className="menu-help">
        Besoin d&apos;une info? Contact rapide sur{' '}
        <a href={shop.whatsappUrl}>WhatsApp</a> ou par appel au{' '}
        <a href={shopLinks.tel}>{shop.phoneDisplay}</a>.
      </p>

      <div className="mobile-actions" aria-label="Actions rapides">
        <a href={shop.whatsappUrl} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a href={shopLinks.tel}>Appeler</a>
      </div>
    </div>
  )
}
