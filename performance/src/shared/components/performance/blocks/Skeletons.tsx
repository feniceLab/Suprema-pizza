/** Skeleton building blocks reutilizáveis (CSS shimmer em .perf-skel*). */

export function SkeletonLine({ size = 'md', width }: { size?: 'sm' | 'md' | 'lg'; width?: string | number }) {
  const cls = `perf-skel-line${size === 'sm' ? ' is-sm' : size === 'lg' ? ' is-lg' : ''}`;
  return <div className={cls} style={width != null ? { width } : undefined} />;
}

export function SkeletonCard({ lines = 3, padding = true }: { lines?: number; padding?: boolean }) {
  return (
    <div className={padding ? 'perf-skel-card' : ''}>
      <SkeletonLine size="sm" />
      <SkeletonLine size="lg" />
      {Array.from({ length: Math.max(0, lines - 2) }).map((_, i) => (
        <SkeletonLine key={i} size="md" width={`${60 + (i * 10) % 30}%`} />
      ))}
    </div>
  );
}

export function SkeletonKpiGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="perf-skel-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={3} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="perf-skel-card">
      <SkeletonLine size="sm" width="40%" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} size="md" width={`${90 - (i * 7) % 30}%`} />
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 240 }: { height?: number }) {
  return (
    <div className="perf-skel-card">
      <SkeletonLine size="sm" width="30%" />
      <div className="perf-skel-box" style={{ height, marginTop: 12 }} />
    </div>
  );
}
