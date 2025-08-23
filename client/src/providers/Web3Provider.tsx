import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

const config = getDefaultConfig({
  appName: 'Chess Chain',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});

const customTheme = darkTheme({
  accentColor: 'hsl(45, 100%, 65%)', // Gold accent
  accentColorForeground: 'hsl(215, 25%, 12%)', // Dark text on gold
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Override specific colors to match our design system
customTheme.colors.modalBackground = 'hsl(205, 50%, 16%)'; // Card background
customTheme.colors.modalBorder = 'hsl(205, 30%, 25%)'; // Border color
customTheme.colors.generalBorder = 'hsl(205, 30%, 25%)'; // General borders
customTheme.colors.menuItemBackground = 'hsl(205, 40%, 20%)'; // Menu items
customTheme.colors.profileAction = 'hsl(205, 40%, 20%)'; // Profile actions
customTheme.colors.profileForeground = 'hsl(210, 40%, 95%)'; // Text color
customTheme.colors.selectedOptionBorder = 'hsl(45, 100%, 65%)'; // Gold selection

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3Provider;
