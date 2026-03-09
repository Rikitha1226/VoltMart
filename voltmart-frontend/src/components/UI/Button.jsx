function Button({ variant = "primary", className = "", ...props }) {
  const classes = [
    "vm-btn",
    variant === "primary" && "vm-btn--primary",
    variant === "secondary" && "vm-btn--secondary",
    variant === "ghost" && "vm-btn--ghost",
    variant === "danger" && "vm-btn--danger",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}

export default Button;
