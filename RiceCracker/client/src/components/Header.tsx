import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Wallet } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // This would be replaced with actual wallet connection logic
      // For example, using ethers.js or web3.js
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Check if on Polygon network, switch if not
        // const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        // if (chainId !== '0x89') { // Polygon Mainnet
        //   // Switch to Polygon
        // }
      } else {
        alert("Please install a compatible wallet like MetaMask to connect to the Polygon network.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/90 dark:bg-background/90 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-4xl emoji-shadow" role="img" aria-label="Rice Cracker">🍘</span>
          <h1 className="text-xl font-bold hidden sm:block">RICE CRACKER GOD PROJECT</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            className="bg-primary hover:bg-primary/80 text-foreground"
            onClick={handleConnectWallet}
            disabled={isConnecting}
          >
            <Wallet className="h-5 w-5 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
};
