type ConfirmModalProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-modal__sheet admin-modal__sheet--small">
        <header className="admin-modal__head">
          <h3>{title}</h3>
        </header>
        <div className="admin-modal__content">
          <p>{message}</p>
        </div>
        <footer className="admin-modal__actions">
          <button type="button" className="ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  )
}
