export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      {children}

      <h1 className="page-title">{title}</h1>

      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
}
