import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pageTitle, shop, shopLinks } from '../config/shop'
import { homeHeroImage, homeHighlights } from '../data/menuImages'
import './Home.css'

export function Home() {
  useEffect(() => {
    document.title = pageTitle.home
  }, [])

  return (
    <div className="home">
      <section className="hero-home" aria-label="Presentation">
        <div className="hero-home__inner">
          <div className="hero-home__copy">
            <p className="hero-home__kicker">Patisserie artisanale - Azzaba</p>
            <h1 className="hero-home__title">Des desserts faits maison, tous les jours.</h1>
            <p className="hero-home__lead">
              Chez {shop.name}, on travaille surtout a la commande du jour: cheesecakes,
              crepes crousti, cinnamon rolls et desserts vitrine.
            </p>
            <div className="hero-home__actions">
              <Link to="/menu" className="btn-main">
                Voir le menu
              </Link>
              <a
                href={shop.whatsappUrl}
                className="btn-muted"
                target="_blank"
                rel="noopener noreferrer"
              >
                Commander sur WhatsApp
              </a>
            </div>
          </div>
          <div className="hero-home__photo">
            <img src={homeHeroImage} alt="Cheesecake maison Al Maroua Bakery" loading="eager" />
          </div>
        </div>
      </section>

      <section className="home-strip" aria-label="Points forts">
        <ul className="home-strip__grid">
          <li className="mini-card">
            <h3>Cheesecakes</h3>
            <p>Parfums classiques + options Lotus, Nutella et pistache.</p>
          </li>
          <li className="mini-card">
            <h3>Crepes minute</h3>
            <p>Pate crousti, garniture genereuse, supplements fruits selon stock.</p>
          </li>
          <li className="mini-card">
            <h3>Vitrine du jour</h3>
            <p>Brownie, tiramisu, fondant et autres portions individuelles.</p>
          </li>
        </ul>
      </section>

      <section className="local-note" aria-labelledby="local-note-title">
        <div className="local-note__card">
          <h2 id="local-note-title">Passez quand vous voulez</h2>
          <p>
            On est a <strong>{shop.address}</strong>, a {shop.city}. Si vous preferez commander
            avant de venir, ecrivez-nous sur WhatsApp ou appelez directement.
          </p>
          <div className="local-note__actions">
            <a href={shopLinks.tel} className="text-link">
              {shop.phoneDisplay}
            </a>
            <a href={shop.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-link">
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="quick-menu" aria-labelledby="quick-menu-title">
        <div className="quick-menu__inner">
          <div>
            <h2 id="quick-menu-title">Menu en ligne</h2>
            <p>
              Ouvrez la page menu sur votre telephone pour voir les categories et les prix mis a
              jour.
            </p>
          </div>
          <Link to="/menu" className="btn-main">
            Ouvrir le menu
          </Link>
        </div>
      </section>

      <section className="home-gallery" aria-labelledby="home-gallery-title">
        <div className="home-gallery__head">
          <h2 id="home-gallery-title">Quelques realisations de la maison</h2>
          <p>Photos reelles de nos produits.</p>
        </div>
        <div className="home-gallery__grid">
          {homeHighlights.map((imagePath, i) => (
            <figure key={imagePath} className="home-gallery__item">
              <img src={imagePath} alt={`Produit Al Maroua ${i + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
