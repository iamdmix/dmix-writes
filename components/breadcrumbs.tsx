import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path}>
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path}>{renderCrumbLabel(item)}</Link>
              )}
              {!isLast && <span aria-hidden="true" className="breadcrumb-separator">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function renderCrumbLabel(item: Crumb): ReactNode {
  return item.path === "/" ? "home" : item.name;
}
