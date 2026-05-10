import { useEffect, useId, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { MenuProduct } from '../../data/menu'

type ProductEditorModalProps = {
  isOpen: boolean
  title: string
  initialValue: MenuProduct
  saving?: boolean
  onClose: () => void
  onSave: (nextProduct: MenuProduct) => void
  onUploadImage: (file: File) => Promise<string>
}

function emptyProduct(): MenuProduct {
  return { name: '', price: 0, details: '', note: '', image: '' }
}

export function ProductEditorModal({
  isOpen,
  title,
  initialValue,
  saving = false,
  onClose,
  onSave,
  onUploadImage,
}: ProductEditorModalProps) {
  const fileInputId = useId()
  const [draft, setDraft] = useState<MenuProduct>(initialValue)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    setDraft(initialValue ?? emptyProduct())
    setUploadError('')
  }, [initialValue, isOpen])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const imageUrl = await onUploadImage(file)
      setDraft((prev) => ({ ...prev, image: imageUrl }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Echec upload image'
      setUploadError(message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-modal__sheet">
        <header className="admin-modal__head">
          <h3>{title}</h3>
        </header>
        <div className="admin-modal__content">
          <div className="admin-modal__preview">
            {draft.image ? (
              <img src={draft.image} alt={draft.name || 'Image produit'} />
            ) : (
              <div className="admin-modal__preview-empty">Aucune image</div>
            )}
          </div>
          <label>
            Nom
            <input
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label>
            Prix
            <input
              type="number"
              value={draft.price}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, price: Number.parseInt(event.target.value || '0', 10) }))
              }
            />
          </label>
          <label>
            Description
            <input
              value={draft.details ?? ''}
              onChange={(event) => setDraft((prev) => ({ ...prev, details: event.target.value }))}
            />
          </label>
          <label>
            Note courte
            <input
              value={draft.note ?? ''}
              onChange={(event) => setDraft((prev) => ({ ...prev, note: event.target.value }))}
            />
          </label>
          <div className="admin-image-upload">
            <p>Image du produit (1 image par produit)</p>
            <input
              id={fileInputId}
              className="admin-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label htmlFor={fileInputId} className="admin-upload-trigger">
              {uploading ? 'Upload en cours...' : draft.image ? 'Changer l image' : 'Ajouter une image'}
            </label>
          </div>
          {uploading && <p className="admin-inline-info">Upload en cours...</p>}
          {uploadError && <p className="admin-inline-error">{uploadError}</p>}
        </div>

        <footer className="admin-modal__actions">
          <button type="button" className="ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="button" onClick={() => onSave(draft)} disabled={saving || uploading}>
            Enregistrer
          </button>
        </footer>
      </div>
    </div>
  )
}
