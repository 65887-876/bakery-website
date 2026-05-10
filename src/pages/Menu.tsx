import { useEffect, useMemo, useState } from 'react'
import { menuSections } from '../data/menu'
import { itemPhoto, menuHeroImage } from '../data/menuImages'
import { pageTitle, shop, shopLinks } from '../config/shop'
import { money } from '../utils/money'
import './Menu.css'

function headingFor(sectionId: string, title: string): string {
  if (sectionId === 'san-sebastien') return 'San Sebastian'
  return title
}

export function Menu() {
  const [activeSection, setActiveSection] = useState(menuSections[0]?.id ?? '')

  const sections = useMemo(() => menuSections, [])

  useEffect(() => {
    document.title = pageTitle.menu
    return () => {
      document.title = pageTitle.home
    }
  }, [])

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node))

    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-90px 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.75],
      },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [sections])

  function jumpToSection(sectionId: string) {
    const node = document.getElementById(sectionId)
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
            <button
              key={section.id}
              type="button"
              className={
                activeSection === section.id
                  ? 'cat-chip cat-chip--active'
                  : 'cat-chip'
              }
              onClick={() => jumpToSection(section.id)}
              aria-pressed={activeSection === section.id}
            >
              {section.title}
            </button>
          ))}
        </div>
      </section>

      <div className="menu-list">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="menu-block"
            aria-labelledby={`cat-${section.id}`}
          >
            <h2 id={`cat-${section.id}`} className="menu-block__title">
              {headingFor(section.id, section.title)}
            </h2>
            {section.smallNote && (
              <p className="menu-block__subtitle">{section.smallNote}</p>
            )}
            <div className="menu-block__grid">
              {section.items.map((item, i) => (
                <article key={`${item.name}-${i}`} className="product-card">
                  <div className="product-card__media">
                    <img
                      src={itemPhoto(section.id, i, item.name)}
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
        ))}
      </div>

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
