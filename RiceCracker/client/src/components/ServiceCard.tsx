import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LockIcon, Volume2Icon, ArrowUpDown, GamepadIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  children: ReactNode;
  icon: "announcement" | "mixing" | "exchange" | "games";
  comingSoon: boolean;
}

export const ServiceCard = ({ title, children, icon, comingSoon }: ServiceCardProps) => {
  const renderIcon = () => {
    switch (icon) {
      case "announcement":
        return <Volume2Icon className="h-6 w-6 mr-2 text-primary" />;
      case "mixing":
        return <MessageSquareIcon className="h-6 w-6 mr-2 text-primary" />;
      case "exchange":
        return <ArrowUpDown className="h-6 w-6 mr-2 text-primary" />;
      case "games":
        return <GamepadIcon className="h-6 w-6 mr-2 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden relative">
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
          <LockIcon className="h-4 w-4 mr-1" />
          Coming Soon
        </div>
      )}
      <CardContent className={`p-6 ${comingSoon ? 'pt-12' : ''}`}>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          {renderIcon()}
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
};

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>
);
