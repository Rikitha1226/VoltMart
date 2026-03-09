function Card({ title, subtitle, actions, children, className = "" }) {
  return (
    <section className={`vm-card ${className}`}>
      {(title || actions) && (
        <header className="vm-card__header">
          <div>
            {title && <h2 className="vm-card__title">{title}</h2>}
            {subtitle && <p className="vm-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="vm-card__actions">{actions}</div>}
        </header>
      )}
      <div className="vm-card__body">{children}</div>
    </section>
  );
}

export default Card;
