type SaveBarProps = {
  visible: boolean
  saving?: boolean
  onSave: () => void
}

export function SaveBar({ visible, saving = false, onSave }: SaveBarProps) {
  if (!visible) return null

  return (
    <div className="admin-savebar" role="status" aria-live="polite">
      <p>Des changements ne sont pas sauvegardes.</p>
      <button type="button" onClick={onSave} disabled={saving}>
        💾 Sauvegarder
      </button>
    </div>
  )
}
