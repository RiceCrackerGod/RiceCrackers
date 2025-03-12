export const HeroSection = () => {
  return (
    <section className="max-w-4xl mx-auto text-center py-10 mb-12">
      <div className="text-6xl mb-4 animate-pulse emoji-shadow" role="img" aria-label="Rice Cracker">🍘</div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">RICE CRACKER GOD PROJECT</h1>
      <p className="text-lg md:text-xl mb-8 text-muted-foreground">
        A revolutionary cryptocurrency project built on the Polygon network, providing a bridge between major blockchain networks.
      </p>
      <div className="inline-block px-6 py-3 rounded-xl bg-secondary dark:bg-secondary/30 shadow-md">
        <span className="font-semibold">$RICECRACKER Token</span>: Connecting Ethereum, Binance Smart Chain, and more via Polygon
      </div>
    </section>
  );
};
