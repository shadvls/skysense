export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-slate-500">{icon}</div>}
      <p className="text-lg font-semibold text-slate-300">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-xs">{description}</p>
      )}
    </div>
  );
}
