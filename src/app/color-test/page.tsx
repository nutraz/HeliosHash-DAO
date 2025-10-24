// src/app/color-test/page.tsx
export default function ColorTestPage() {
  const newColors = [
    'success', 'info', 'warning', 'error',
    'saffron', 'green', 'navy'
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Color Variables Test</h1>
      
      {/* Light Mode Test */}
      <div className="space-y-4 p-4 border rounded">
        <h2 className="text-lg font-semibold">Light Mode</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newColors.map(color => (
            <div key={`light-${color}`} className={`p-4 bg-${color} text-${color}-foreground border border-${color} rounded`}>
              {color}
            </div>
          ))}
        </div>
      </div>

      {/* Dark Mode Test */}
      <div className="dark space-y-4 p-4 border rounded bg-black text-white">
        <h2 className="text-lg font-semibold">Dark Mode</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newColors.map(color => (
            <div key={`dark-${color}`} className={`p-4 bg-${color} text-${color}-foreground border border-${color} rounded`}>
              {color}
            </div>
          ))}
        </div>
      </div>

      {/* Brand Colors Specific Test */}
      <div className="space-y-4 p-4 border rounded">
        <h2 className="text-lg font-semibold">Brand Colors (HeliosHash)</h2>
        <div className="flex gap-4">
          <div className="p-4 bg-saffron text-saffron-foreground rounded">Saffron</div>
          <div className="p-4 bg-green text-green-foreground rounded">Green</div>
          <div className="p-4 bg-navy text-navy-foreground rounded">Navy</div>
        </div>
      </div>
    </div>
  );
}
