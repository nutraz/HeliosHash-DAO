"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TestUIPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">UI Components Test</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">Icon</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input Fields</h2>
        <div className="space-y-4 max-w-md">
          <Input placeholder="Default input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
          <Input disabled placeholder="Disabled input" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Test</h2>
        <div className="space-y-4 max-w-md">
          <Input placeholder="Type something..." />
          <Button onClick={() => alert("Button clicked!")}>Click Me</Button>
        </div>
      </section>
    </div>
  );
}
