'use client';

import { useState, useEffect } from 'react';

export default function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-4 px-4 md:px-8 bg-secondary/30 text-muted-foreground text-xs text-center">
      <div className="container mx-auto">
        <p>&copy; {year || new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
}
