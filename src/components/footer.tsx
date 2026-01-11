'use client';

import { useState, useEffect } from 'react';

export default function AppFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-4 px-4 md:px-8 bg-secondary/30 text-muted-foreground text-xs text-center">
      <div className="container mx-auto">
        <p>&copy; {year} FG Universal Empire (SSM No.: 202503270156 (IP0614068-A)). All Rights Reserved.</p>
        <p>Developed by Faiz Nasir.</p>
      </div>
    </footer>
  );
}
