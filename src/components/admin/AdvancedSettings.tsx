type AdvancedSettingsProps = {
  newCategoryTitle: string
  onNewCategoryTitleChange: (value: string) => void
  onAddCategory: () => void
  onDeleteSelectedCategory: () => void
  onResetMenu: () => void
  disableDeleteCategory?: boolean
}

export function AdvancedSettings({
  newCategoryTitle,
  onNewCategoryTitleChange,
  onAddCategory,
  onDeleteSelectedCategory,
  onResetMenu,
  disableDeleteCategory = false,
}: AdvancedSettingsProps) {
  return (
    <details className="admin-advanced">
      <summary>Options avancees</summary>
      <div className="admin-advanced__content">
        <div className="admin-add-cat">
          <input
            value={newCategoryTitle}
            placeholder="Nouvelle categorie"
            onChange={(event) => onNewCategoryTitleChange(event.target.value)}
          />
          <button type="button" onClick={onAddCategory}>
            Ajouter categorie
          </button>
        </div>
        <button type="button" className="danger" onClick={onDeleteSelectedCategory} disabled={disableDeleteCategory}>
          Supprimer categorie
        </button>
        <button type="button" className="danger" onClick={onResetMenu}>
          Reinitialiser tout le menu
        </button>
      </div>
    </details>
  )
}
