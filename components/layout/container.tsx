import { cn } from '@/lib/utils';

/** 컨테이너 — max-w 1200, 좌우 패딩 고정 (context/design/03-spacing.md) */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-container px-5 md:px-8', className)}>{children}</div>
  );
}
