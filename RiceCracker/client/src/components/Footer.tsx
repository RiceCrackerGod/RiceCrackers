export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 dark:bg-background/50 border-t border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-2xl emoji-shadow mr-2" role="img" aria-label="Rice Cracker">🍘</span>
            <span className="font-semibold">RICE CRACKER GOD PROJECT</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Built on the <span className="font-medium">Polygon</span> network
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {currentYear} RICE CRACKER GOD PROJECT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
