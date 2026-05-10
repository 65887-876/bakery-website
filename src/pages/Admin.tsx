import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { isCloudinaryConfigured, uploadImageToCloudinary } from '../config/cloudinary'
import { menuSections, type MenuCategory } from '../data/menu'
import { itemPhoto } from '../data/menuImages'
import { readMenuData, resetMenuData, writeMenuData } from '../data/menuStore'
import './Admin.css'

function onlyLatin(value: string): string {
  // Remove Arabic script characters while keeping latin text and punctuation.
  return value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, '')
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function hydrateMissingImages(data: MenuCategory[]): { nextData: MenuCategory[]; changed: boolean } {
  let changed = false
  const nextData = data.map((section) => ({
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

  return { nextData, changed }
}

function toId(value: string): string {
  const base = onlyLatin(value)
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

export function Admin() {
  const [draft, setDraft] = useState<MenuCategory[]>(() => readMenuData())
  const [selectedId, setSelectedId] = useState<string>(draft[0]?.id ?? '')
  const [status, setStatus] = useState('')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const [uploadingKey, setUploadingKey] = useState('')

  const selectedIndex = useMemo(
    () => draft.findIndex((section) => section.id === selectedId),
    [draft, selectedId],
  )
  const selected = selectedIndex >= 0 ? draft[selectedIndex] : null

  useEffect(() => {
    const { nextData, changed } = hydrateMissingImages(readMenuData())
    if (!changed) return
    setDraft(nextData)
    writeMenuData(nextData)
  }, [])

  function updateSection(next: Partial<MenuCategory>) {
    if (selectedIndex < 0 || !selected) return
    const nextDraft = deepClone(draft)
    nextDraft[selectedIndex] = { ...selected, ...next }
    setDraft(nextDraft)
    writeMenuData(nextDraft)
  }

  function updateItem(itemIndex: number, next: Partial<MenuCategory['items'][number]>) {
    if (selectedIndex < 0 || !selected?.items[itemIndex]) return
    const nextDraft = deepClone(draft)
    nextDraft[selectedIndex].items[itemIndex] = {
      ...nextDraft[selectedIndex].items[itemIndex],
      ...next,
    }
    setDraft(nextDraft)
    writeMenuData(nextDraft)
  }

  function addProduct() {
    if (selectedIndex < 0) return
    const nextDraft = deepClone(draft)
    nextDraft[selectedIndex].items.push({
      name: 'Nouveau produit',
      price: 0,
      details: '',
      note: '',
      image: '',
    })
    setDraft(nextDraft)
    writeMenuData(nextDraft)
  }

  function removeProduct(itemIndex: number) {
    if (selectedIndex < 0) return
    const nextDraft = deepClone(draft)
    if (!nextDraft[selectedIndex].items[itemIndex]) return
    nextDraft[selectedIndex].items.splice(itemIndex, 1)
    setDraft(nextDraft)
    writeMenuData(nextDraft)
  }

  function save() {
    writeMenuData(draft)
    setStatus('Sauvegarde reussie')
    setTimeout(() => setStatus(''), 1800)
  }

  function restoreDefaults() {
    const defaults = deepClone(menuSections)
    resetMenuData()
    setDraft(defaults)
    setSelectedId(defaults[0]?.id ?? '')
    setStatus('Menu reinitialise')
    setTimeout(() => setStatus(''), 1800)
  }

  function addCategory() {
    const cleanTitle = onlyLatin(newCategoryTitle).trim()
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
    writeMenuData(nextDraft)
    setSelectedId(next.id)
    setNewCategoryTitle('')
  }

  function removeSelectedCategory() {
    if (!selected || draft.length <= 1) return
    const nextDraft = draft.filter((section) => section.id !== selected.id)
    setDraft(nextDraft)
    writeMenuData(nextDraft)
    setSelectedId(nextDraft[0]?.id ?? '')
  }

  async function handleImageUpload(itemIndex: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!isCloudinaryConfigured()) {
      setStatus('Cloudinary non configure. Ajoutez VITE_CLOUDINARY_CLOUD_NAME.')
      event.target.value = ''
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setStatus('Image trop lourde. Maximum 8MB.')
      event.target.value = ''
      return
    }

    const key = `${selectedId}-${itemIndex}`
    setUploadingKey(key)
    setStatus('Upload image en cours...')

    try {
      const imageUrl = await uploadImageToCloudinary(file)
      updateItem(itemIndex, { image: imageUrl })
      setStatus('Image envoyee')
    } catch (error) {
      // Keep admin usable even when Cloudinary is unavailable in local dev.
      try {
        const localImage = await readFileAsDataUrl(file)
        updateItem(itemIndex, { image: localImage })
        setStatus('Image sauvegardee localement')
      } catch {
        const message = error instanceof Error ? error.message : 'Echec upload image.'
        setStatus(message)
      }
    } finally {
      setUploadingKey('')
      // reset input so the same file can be re-selected
      event.target.value = ''
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1>Admin menu simple</h1>
        <p>Etape 1: choisir une categorie. Etape 2: modifier les produits. Etape 3: sauvegarder.</p>
        {!isCloudinaryConfigured() && (
          <p className="admin-cloudinary-alert">
            Cloudinary non configure. Upload distant desactive, sauvegarde locale active.
          </p>
        )}
      </div>

      <section className="admin-editor">
        <div className="admin-basic-top">
          <label>
            Categorie
            <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
              {draft.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={addProduct} disabled={!selected}>
            + Ajouter produit
          </button>
        </div>

        {!selected && <p>Selectionnez une categorie.</p>}
        {selected && (
          <>
            <div className="admin-fieldset">
              <label htmlFor="cat-title">Titre categorie</label>
              <input
                id="cat-title"
                value={selected.title}
                onChange={(event) => updateSection({ title: onlyLatin(event.target.value) })}
              />
            </div>
            <div className="admin-fieldset">
              <label htmlFor="cat-note">Sous titre categorie</label>
              <input
                id="cat-note"
                value={selected.smallNote ?? ''}
                onChange={(event) => updateSection({ smallNote: onlyLatin(event.target.value) })}
              />
            </div>

            <h2 className="admin-editor__title">Produits ({selected.items.length})</h2>
            {selected.items.length === 0 && (
              <p className="admin-empty-products">Aucun produit. Appuyez sur + Ajouter produit.</p>
            )}

            <div className="admin-items">
              {selected.items.map((item, idx) => (
                <article key={`${selected.id}-${idx}`} className="admin-item">
                  <p className="admin-item__index">Produit {idx + 1}</p>
                  {uploadingKey === `${selected.id}-${idx}` && (
                    <p className="admin-uploading">Upload en cours...</p>
                  )}
                  <div className="admin-item__grid">
                    <label>
                      Nom
                      <input
                        value={item.name}
                        onChange={(event) => updateItem(idx, { name: onlyLatin(event.target.value) })}
                      />
                    </label>
                    <label>
                      Prix (DA)
                      <input
                        type="number"
                        value={item.price}
                        onChange={(event) =>
                          updateItem(idx, {
                            price: Number.parseInt(event.target.value || '0', 10),
                          })
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Description
                    <input
                      value={item.details ?? ''}
                      onChange={(event) => updateItem(idx, { details: onlyLatin(event.target.value) })}
                    />
                  </label>
                  <label>
                    Note courte
                    <input
                      value={item.note ?? ''}
                      onChange={(event) => updateItem(idx, { note: onlyLatin(event.target.value) })}
                    />
                  </label>
                  <label>
                    URL image
                    <input
                      value={item.image ?? ''}
                      onChange={(event) => updateItem(idx, { image: event.target.value })}
                      placeholder="/photos/photo-01.png ou https://..."
                    />
                  </label>
                  <label>
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(idx, event)}
                      disabled={uploadingKey === `${selected.id}-${idx}`}
                    />
                  </label>

                  <div className="admin-image-actions">
                    <button
                      type="button"
                      className="admin-image-actions__ghost"
                      onClick={() => {
                        updateItem(idx, { image: '' })
                        setStatus('Image retiree')
                      }}
                    >
                      Retirer image
                    </button>
                    <button
                      type="button"
                      className="admin-image-actions__danger"
                      onClick={() => removeProduct(idx)}
                    >
                      Supprimer produit
                    </button>
                  </div>
                  <img
                    src={itemPhoto(selected.id, idx, item.name, item.image)}
                    alt={item.name}
                    className="admin-image-preview"
                  />
                </article>
              ))}
            </div>

            <details className="admin-advanced">
              <summary>Options avancees</summary>
              <div className="admin-advanced__content">
                <div className="admin-add-cat">
                  <input
                    value={newCategoryTitle}
                    placeholder="Nouvelle categorie"
                    onChange={(event) => setNewCategoryTitle(onlyLatin(event.target.value))}
                  />
                  <button type="button" onClick={addCategory}>
                    Ajouter categorie
                  </button>
                </div>
                <button
                  type="button"
                  className="admin-cat-actions__danger"
                  onClick={removeSelectedCategory}
                  disabled={draft.length <= 1}
                >
                  Supprimer categorie selectionnee
                </button>
                <button type="button" className="admin-actions__ghost" onClick={restoreDefaults}>
                  Reinitialiser tout le menu
                </button>
              </div>
            </details>
          </>
        )}
      </section>

      <div className="admin-actions">
        <button type="button" onClick={save}>
          Sauvegarder
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  )
}
