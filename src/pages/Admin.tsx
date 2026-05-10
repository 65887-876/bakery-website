import { useEffect, useMemo, useState } from 'react'
import { uploadImageToCloudinary } from '../config/cloudinary'
import { AdvancedSettings } from '../components/admin/AdvancedSettings'
import { AdminLayout } from '../components/admin/AdminLayout'
import { CategorySelector } from '../components/admin/CategorySelector'
import { ConfirmModal } from '../components/admin/ConfirmModal'
import { ProductCard } from '../components/admin/ProductCard'
import { ProductEditorModal } from '../components/admin/ProductEditorModal'
import { SaveBar } from '../components/admin/SaveBar'
import { menuSections, type MenuCategory, type MenuProduct } from '../data/menu'
import { itemPhoto } from '../data/menuImages'
import { readMenuData, writeMenuData } from '../data/menuStore'
import './Admin.css'

const UNSAVED_DRAFT_KEY = 'bakery.menu.admin.unsaved.v2'

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function hydrateMissingImages(data: MenuCategory[]): { data: MenuCategory[]; changed: boolean } {
  let changed = false
  const hydrated = data.map((section) => ({
    ...section,
    items: section.items.map((item, itemIndex) => {
      const hasImage = Boolean(item.image && item.image.trim().length > 0)
      if (hasImage) return item
      changed = true
      return {
        ...item,
        image: itemPhoto(section.id, itemIndex, item.name, item.image),
      }
    }),
  }))

  return { data: hydrated, changed }
}

function toId(value: string): string {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `cat-${Date.now()}`
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Lecture image impossible.'))
    }
    reader.onerror = () => reject(new Error('Lecture image impossible.'))
    reader.readAsDataURL(file)
  })
}

function emptyProduct(): MenuProduct {
  return {
    name: '',
    price: 0,
    details: '',
    note: '',
    image: '',
  }
}

type ConfirmState =
  | { type: 'delete-product'; productIndex: number }
  | { type: 'delete-category' }
  | { type: 'reset-menu' }
  | null

type RecoverDraft = {
  data: MenuCategory[]
  selectedCategoryId?: string
}

export function Admin() {
  const [draft, setDraft] = useState<MenuCategory[]>(() => {
    const { data, changed } = hydrateMissingImages(readMenuData())
    if (changed) writeMenuData(data)
    return data
  })
  const [selectedId, setSelectedId] = useState<string>(() => readMenuData()[0]?.id ?? '')
  const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'settings'>('categories')
  const [toast, setToast] = useState('')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const [savedSnapshot, setSavedSnapshot] = useState<string>(() =>
    JSON.stringify(hydrateMissingImages(readMenuData()).data),
  )
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null)
  const [editorInitialValue, setEditorInitialValue] = useState<MenuProduct>(emptyProduct())
  const [confirmState, setConfirmState] = useState<ConfirmState>(null)
  const [recoverDraft, setRecoverDraft] = useState<RecoverDraft | null>(null)

  const selectedCategory = useMemo(
    () => draft.find((section) => section.id === selectedId) ?? null,
    [draft, selectedId],
  )
  const serializedDraft = useMemo(() => JSON.stringify(draft), [draft])
  const hasChanges = serializedDraft !== savedSnapshot

  useEffect(() => {
    if (!selectedCategory && draft[0]) {
      setSelectedId(draft[0].id)
    }
  }, [selectedCategory, draft])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(UNSAVED_DRAFT_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as RecoverDraft
      if (!Array.isArray(parsed.data) || parsed.data.length === 0) {
        window.localStorage.removeItem(UNSAVED_DRAFT_KEY)
        return
      }
      if (JSON.stringify(parsed.data) !== savedSnapshot) {
        setRecoverDraft(parsed)
      } else {
        window.localStorage.removeItem(UNSAVED_DRAFT_KEY)
      }
    } catch {
      window.localStorage.removeItem(UNSAVED_DRAFT_KEY)
    }
  }, [savedSnapshot])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!hasChanges) {
      window.localStorage.removeItem(UNSAVED_DRAFT_KEY)
      return
    }
    window.localStorage.setItem(
      UNSAVED_DRAFT_KEY,
      JSON.stringify({
        data: draft,
        selectedCategoryId: selectedId,
      }),
    )
  }, [draft, selectedId, hasChanges])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function updateCategory(categoryId: string, next: Partial<MenuCategory>) {
    const nextDraft = draft.map((section) => (section.id === categoryId ? { ...section, ...next } : section))
    setDraft(nextDraft)
  }

  function saveProduct(nextProduct: MenuProduct) {
    if (!selectedCategory) return
    const nextDraft = deepClone(draft)
    const categoryIndex = nextDraft.findIndex((section) => section.id === selectedCategory.id)
    if (categoryIndex < 0) return
    if (editorMode === 'create') {
      nextDraft[categoryIndex].items.push(nextProduct)
    } else if (
      typeof editingProductIndex === 'number' &&
      nextDraft[categoryIndex].items[editingProductIndex]
    ) {
      nextDraft[categoryIndex].items[editingProductIndex] = nextProduct
    }
    setDraft(nextDraft)
    setEditorOpen(false)
    setToast(editorMode === 'create' ? 'Produit ajoute' : 'Produit modifie')
  }

  function save() {
    writeMenuData(draft)
    setSavedSnapshot(serializedDraft)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(UNSAVED_DRAFT_KEY)
    }
    setToast('Sauvegarde reussie')
  }

  function restoreDefaultsConfirmed() {
    const defaults = deepClone(menuSections)
    setDraft(defaults)
    setSelectedId(defaults[0]?.id ?? '')
    setEditorOpen(false)
    setConfirmState(null)
    setToast('Menu reinitialise')
  }

  function addCategory() {
    const cleanTitle = newCategoryTitle.trim()
    if (!cleanTitle) return

    const ids = new Set(draft.map((section) => section.id))
    let candidate = toId(cleanTitle)
    let i = 2
    while (ids.has(candidate)) {
      candidate = `${toId(cleanTitle)}-${i}`
      i += 1
    }

    const next: MenuCategory = {
      id: candidate,
      title: cleanTitle,
      smallNote: '',
      items: [],
    }

    const nextDraft = [...draft, next]
    setDraft(nextDraft)
    setSelectedId(next.id)
    setNewCategoryTitle('')
    setActiveTab('categories')
    setToast('Categorie ajoutee')
  }

  function removeSelectedCategoryConfirmed() {
    if (!selectedCategory || draft.length <= 1) return
    const nextDraft = draft.filter((section) => section.id !== selectedCategory.id)
    setDraft(nextDraft)
    setSelectedId(nextDraft[0]?.id ?? '')
    setConfirmState(null)
    setToast('Categorie supprimee')
  }

  async function uploadImage(file: File): Promise<string> {
    if (file.size > 8 * 1024 * 1024) {
      throw new Error('Image trop lourde. Maximum 8MB.')
    }

    try {
      return await uploadImageToCloudinary(file)
    } catch (error) {
      try {
        return await readFileAsDataUrl(file)
      } catch {
        const message = error instanceof Error ? error.message : 'Echec upload image'
        throw new Error(message)
      }
    }
  }

  function requestDeleteProduct(productIndex: number) {
    setConfirmState({ type: 'delete-product', productIndex })
  }

  function runConfirmedAction() {
    if (!confirmState) return
    if (confirmState.type === 'delete-product' && selectedCategory) {
      const nextDraft = deepClone(draft)
      const categoryIndex = nextDraft.findIndex((section) => section.id === selectedCategory.id)
      if (categoryIndex >= 0 && nextDraft[categoryIndex].items[confirmState.productIndex]) {
        nextDraft[categoryIndex].items.splice(confirmState.productIndex, 1)
        setDraft(nextDraft)
        setToast('Produit supprime')
      }
      setConfirmState(null)
      return
    }

    if (confirmState.type === 'delete-category') {
      removeSelectedCategoryConfirmed()
      return
    }

    if (confirmState.type === 'reset-menu') {
      restoreDefaultsConfirmed()
    }
  }

  function openCreateProductModal() {
    setEditorMode('create')
    setEditingProductIndex(null)
    setEditorInitialValue(emptyProduct())
    setEditorOpen(true)
  }

  function openEditProductModal(productIndex: number) {
    if (!selectedCategory?.items[productIndex]) return
    setEditorMode('edit')
    setEditingProductIndex(productIndex)
    setEditorInitialValue(deepClone(selectedCategory.items[productIndex]))
    setEditorOpen(true)
  }

  function restoreRecoveredDraft() {
    if (!recoverDraft?.data?.length) return
    setDraft(recoverDraft.data)
    setSelectedId(recoverDraft.selectedCategoryId ?? recoverDraft.data[0].id)
    setRecoverDraft(null)
    setToast('Brouillon restaure')
  }

  function ignoreRecoveredDraft() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(UNSAVED_DRAFT_KEY)
    }
    setRecoverDraft(null)
  }

  const confirmTitle =
    confirmState?.type === 'delete-product'
      ? 'Supprimer ce produit ?'
      : confirmState?.type === 'delete-category'
        ? 'Supprimer cette categorie ?'
        : 'Reinitialiser tout le menu ?'

  const confirmMessage =
    confirmState?.type === 'delete-product'
      ? 'Cette action retire le produit de la liste.'
      : confirmState?.type === 'delete-category'
        ? 'Cette action retire la categorie entiere.'
        : 'Cette action ecrase toutes les modifications locales.'

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {recoverDraft && (
        <section className="admin-recover">
          <p>Des modifications non sauvegardees ont ete retrouvees.</p>
          <div>
            <button type="button" onClick={restoreRecoveredDraft}>
              Restaurer
            </button>
            <button type="button" className="ghost" onClick={ignoreRecoveredDraft}>
              Ignorer
            </button>
          </div>
        </section>
      )}

      {activeTab === 'categories' && (
        <CategorySelector
          categories={draft}
          selectedId={selectedId}
          onSelectCategory={(categoryId) => {
            setSelectedId(categoryId)
            setActiveTab('products')
          }}
          onEditCategory={(categoryId) => {
            setSelectedId(categoryId)
            setActiveTab('products')
          }}
        />
      )}

      {activeTab === 'products' && (
        <section className="admin-panel">
          <div className="admin-products-head">
            <h2>{selectedCategory?.title ?? 'Selectionnez une categorie'}</h2>
            <p>{selectedCategory?.items.length ?? 0} produits</p>
          </div>

          {selectedCategory && (
            <label className="admin-category-meta">
              Sous-titre categorie
              <input
                value={selectedCategory.smallNote ?? ''}
                onChange={(event) =>
                  updateCategory(selectedCategory.id, {
                    smallNote: event.target.value,
                  })
                }
              />
            </label>
          )}

          <div className="admin-products-list">
            {selectedCategory?.items.map((product, index) => (
              <ProductCard
                key={`${product.name}-${index}`}
                categoryId={selectedCategory.id}
                index={index}
                product={product}
                onEdit={() => openEditProductModal(index)}
                onDelete={() => requestDeleteProduct(index)}
              />
            ))}
          </div>

          <button
            type="button"
            className="admin-fab"
            onClick={openCreateProductModal}
            disabled={!selectedCategory}
          >
            + Ajouter produit
          </button>
        </section>
      )}

      {activeTab === 'settings' && (
        <section className="admin-panel">
          <h2>Parametres</h2>
          {selectedCategory && (
            <label className="admin-category-meta">
              Nom categorie
              <input
                value={selectedCategory.title}
                onChange={(event) =>
                  updateCategory(selectedCategory.id, {
                    title: event.target.value,
                  })
                }
              />
            </label>
          )}
          <AdvancedSettings
            newCategoryTitle={newCategoryTitle}
            onNewCategoryTitleChange={setNewCategoryTitle}
            onAddCategory={addCategory}
            onDeleteSelectedCategory={() => setConfirmState({ type: 'delete-category' })}
            onResetMenu={() => setConfirmState({ type: 'reset-menu' })}
            disableDeleteCategory={draft.length <= 1}
          />
        </section>
      )}

      <ProductEditorModal
        isOpen={editorOpen}
        title={editorMode === 'create' ? 'Ajouter un produit' : 'Modifier le produit'}
        initialValue={editorInitialValue}
        onClose={() => setEditorOpen(false)}
        onSave={saveProduct}
        onUploadImage={uploadImage}
      />

      <ConfirmModal
        open={Boolean(confirmState)}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel="Oui, confirmer"
        onCancel={() => setConfirmState(null)}
        onConfirm={runConfirmedAction}
      />

      <SaveBar visible={hasChanges} onSave={save} />
      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  )
}
