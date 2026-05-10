import type { ReactNode } from 'react'

type AdminTab = 'categories' | 'products' | 'settings'

type AdminLayoutProps = {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
  children: ReactNode
}

const tabLabels: Record<AdminTab, string> = {
  categories: 'Categories',
  products: 'Produits',
  settings: 'Parametres',
}

export function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="admin-topbar__eyebrow">Al Maroua Bakery</p>
          <h1>Gestion du menu</h1>
        </div>
      </header>

      <div className="admin-stepper" aria-label="Etapes de gestion">
        {(['categories', 'products', 'settings'] as const).map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'admin-step admin-step--active' : 'admin-step'}
            onClick={() => onTabChange(tab)}
          >
            <span>{`Etape ${index + 1}`}</span>
            <strong>{tabLabels[tab]}</strong>
          </button>
        ))}
      </div>

      <main className="admin-content">{children}</main>

      <nav className="admin-bottom-tabs" aria-label="Navigation admin mobile">
        {(['categories', 'products', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'admin-bottom-tab admin-bottom-tab--active' : 'admin-bottom-tab'}
            onClick={() => onTabChange(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </nav>
    </div>
  )
}
