import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  color?: string;
}

export function PageHeader({ title, description, color = '#4f46e5' }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-background border border-border/50 p-8 md:p-12 mb-8">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-10"
        style={{ backgroundColor: color }}
      />

      {/* Decorative shapes */}
      <div className="absolute top-4 right-4 w-6 h-6 border-2 border-current opacity-20 rotate-45" style={{ borderColor: color }} />
      <div className="absolute bottom-4 left-8 w-4 h-4 rounded-full opacity-30" style={{ backgroundColor: color }} />

      <div className="relative space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1.5 h-10 rounded-full shadow-lg"
              style={{ backgroundColor: color }}
            />
            <span
              className="text-sm font-semibold px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border shadow-sm"
              style={{ color: color, borderColor: color + '40' }}
            >
              📁 Categoria
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {description && (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/60 shadow-sm">
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Enhanced decorative elements */}
        <div className="flex items-center gap-3 pt-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color + '60' }} />
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color + '80' }} />
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-border via-border/60 to-transparent" />
          <span className="text-xs text-muted-foreground font-medium px-3 py-1 bg-white/40 rounded-full">
            Artigos
          </span>
        </div>
      </div>
    </div>
  );
}