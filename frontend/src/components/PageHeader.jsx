export default function PageHeader({ icon: Icon, title, subtitle, accent = 'blue' }) {
  const accents = {
    blue: 'bg-primary/10 text-primary',
    teal: 'bg-teal/10 text-teal',
    amber: 'bg-amber/10 text-amber',
    rose: 'bg-rose/10 text-rose',
  };
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accents[accent]}`}>
        <Icon size={20} />
      </div>
      <div>
        <h1 className="font-display text-xl font-700 text-t1 leading-tight">{title}</h1>
        {subtitle && <p className="text-t2 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}