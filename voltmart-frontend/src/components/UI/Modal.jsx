function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="vm-modal">
      <div className="vm-modal__backdrop" onClick={onClose} />
      <div className="vm-modal__dialog">
        <header className="vm-modal__header">
          <h3 className="vm-modal__title">{title}</h3>
          <button className="vm-modal__close" type="button" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="vm-modal__body">{children}</div>
        {footer && <footer className="vm-modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}

export default Modal;
