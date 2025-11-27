"use client";

import React from 'react';
import Link from 'next/link';

export default function Breadcrumbs(props: { items?: Array<{ label: string; href?: string }>; dashboard?: any }) {
  const { items, dashboard } = props;
  // If dashboard is provided, build simple breadcrumbs from its state.
  const crumbs = items || (dashboard ? [{ label: 'Home', href: '/' }, { label: 'Dashboard' }] : []);

  return (
    <nav className="text-sm text-gray-400 mb-4">
      {crumbs.map((it, idx) => (
        <span key={idx}>
          {it.href ? (
            <Link href={it.href}>
              <a className="text-gray-300 hover:underline">{it.label}</a>
            </Link>
          ) : (
            <span>{it.label}</span>
          )}
          {idx < crumbs.length - 1 && <span className="mx-2">›</span>}
        </span>
      ))}
    </nav>
  );
}

