export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const variantClass =
    variant === "secondary"
      ? "secondary-btn"
      : variant === "danger"
        ? "mr-delete-btn"
        : "primary-btn";

  return (
    <button
      type={type}
      className={`${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
