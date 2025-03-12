import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Share2Icon, FileTextIcon } from "lucide-react";

const Home = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <HeroSection />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ServiceCard
            title="Official Statements"
            icon="announcement"
            comingSoon={false}
          >
            <div className="mb-6 bg-secondary/50 dark:bg-slate-700/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">$RICECRACKER Price</h3>
                <div className="font-mono text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                  $0.0425 USD
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Last updated: June 14, 2023 12:30 UTC
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <span>Airdrops of RICECRACKER Coin announced monthly</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <span>Project updates, including new features and network expansions</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <span>Community-related news and upcoming events</span>
              </li>
            </ul>
          </ServiceCard>
          
          <ServiceCard
            title="Tumblers (Mixing Service)"
            icon="mixing"
            comingSoon={true}
          >
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              A cryptocurrency mixing service aiming to be a leading solution in the industry.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
                <h3 className="font-semibold mb-1">Process</h3>
                <p className="text-sm">
                  Deposit bridged cryptocurrency from supported networks, convert to RICECRACKER Coin, 
                  and withdraw to a new address via our mixing pool.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
                <h3 className="font-semibold mb-1">Timeline</h3>
                <p className="text-sm">Mixing takes 1–3 days, with a maximum limit (TBD).</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
                <h3 className="font-semibold mb-1">Purpose</h3>
                <p className="text-sm">
                  Utilizes an internal token pool to scramble transaction histories, 
                  ensuring untraceable and redeemable funds.
                </p>
              </div>
            </div>
          </ServiceCard>
          
          <ServiceCard
            title="Decentralized Exchange Hub"
            icon="exchange"
            comingSoon={true}
          >
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              A multi-functional platform where users connect wallets and access various DeFi services.
            </p>
            <ul className="grid grid-cols-2 gap-3 mb-4">
              <li className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded flex items-center text-sm">
                <DollarSignIcon className="h-4 w-4 mr-1 text-primary" />
                Provide pool liquidity
              </li>
              <li className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded flex items-center text-sm">
                <ShieldIcon className="h-4 w-4 mr-1 text-primary" />
                Stake RICECRACKER Coin
              </li>
              <li className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded flex items-center text-sm">
                <PlusIcon className="h-4 w-4 mr-1 text-primary" />
                Create tokens
              </li>
              <li className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded flex items-center text-sm">
                <WalletIcon className="h-4 w-4 mr-1 text-primary" />
                Fund projects or take loans
              </li>
            </ul>
            <div className="p-3 border border-dashed border-primary/50 dark:border-primary/30 rounded-lg">
              <h3 className="font-semibold mb-2">Web3 Freelancer Marketplace</h3>
              <p className="text-sm mb-2">
                Connect with freelancers and view their reputation based on past projects 
                within the RICECRACKER ecosystem.
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Wallet addresses are linked to project history for enhanced trust and reliability.
              </div>
            </div>
          </ServiceCard>
          
          <ServiceCard
            title="Games"
            icon="games"
            comingSoon={true}
          >
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              Probability-based games powered by RICECRACKER Coin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-secondary/50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <ZapIcon className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-semibold">Lottery</h3>
                </div>
                <p className="text-sm">
                  Players participate using RICECRACKER Coin for a chance to win prizes 
                  in Player vs. House (PvH) games.
                </p>
              </div>
              <div className="bg-secondary/50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <LayoutGridIcon className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-semibold">Card Game</h3>
                </div>
                <p className="text-sm">
                  Player vs. Player (PvP) mode with RICECRACKER Coin as the betting currency.
                </p>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
              <span className="italic">More games will be added to the platform in the future.</span>
            </div>
          </ServiceCard>
        </div>
        
        <section className="max-w-4xl mx-auto text-center py-8 mb-8">
          <div className="bg-gradient-to-r from-secondary to-primary/30 dark:from-slate-800/50 dark:to-primary/20 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Join the RICE CRACKER Community</h2>
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              Be part of the revolution in cryptocurrency bridging and enjoy our upcoming services!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-primary hover:bg-primary/80 text-white" size="lg">
                <Share2Icon className="mr-2 h-5 w-5" />
                Share Project
              </Button>
              <Button variant="outline" size="lg">
                <FileTextIcon className="mr-2 h-5 w-5" />
                Whitepaper
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const WalletIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LayoutGridIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
);

export default Home;
