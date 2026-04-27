import type { ComponentProps } from "react";

/**
 * Craft Semantic Layout System
 *
 * Provides semantic HTML wrappers with consistent spacing and layout.
 * All components are Server Components by default (no "use client").
 *
 * Usage:
 *   <Main>
 *     <Section>
 *       <Container>
 *         <Grid cols={3}>{children}</Grid>
 *       </Container>
 *     </Section>
 *   </Main>
 */

/* ─── Main ─────────────────────────────────────────── */
type MainProps = ComponentProps<"main">;

export function Main({ className = "", children, ...props }: MainProps) {
  return (
    <main className={`flex-1 ${className}`} {...props}>
      {children}
    </main>
  );
}

/* ─── Section ──────────────────────────────────────── */
type SectionProps = ComponentProps<"section">;

export function Section({ className = "", children, ...props }: SectionProps) {
  return (
    <section className={`py-12 md:py-24 ${className}`} {...props}>
      {children}
    </section>
  );
}

/* ─── Container ────────────────────────────────────── */
type ContainerProps = ComponentProps<"div">;

export function Container({
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl px-4 md:px-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ─── Grid ─────────────────────────────────────────── */
const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
} as const;

type GridProps = ComponentProps<"div"> & {
  cols?: 1 | 2 | 3 | 4;
  gap?: 4 | 6 | 8;
};

export function Grid({
  cols = 3,
  gap = 6,
  className = "",
  children,
  ...props
}: GridProps) {
  const colClass = gridColsMap[cols];
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid ${colClass} ${gapClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
