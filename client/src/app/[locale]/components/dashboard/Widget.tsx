interface WidgetProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  showGrid?: boolean;
}

export default function Widget({ title, children, action, className = '', showGrid = false }: WidgetProps) {
  return (
    <div className={`bg-neutral-900/50 border border-neutral-800 rounded-lg p-5 h-full relative overflow-hidden ${className}`}>
      {/* Background Grid */}
      {showGrid && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      )}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
}
