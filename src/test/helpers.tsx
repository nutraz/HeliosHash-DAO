import { render, RenderOptions } from '@testing-library/react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { Web3Modal } from '@web3modal/react';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import * as React from 'react';

const projectId = 'test-walletconnect-project-id';
const chains = [mainnet] as const;
const wagmiConfig = createConfig({
  chains,
  connectors: w3mConnectors({ projectId, chains: [...chains] }),
  transports: {
    [mainnet.id]: http(),
  },
});
const ethereumClient = new EthereumClient(wagmiConfig, [...chains]);

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={wagmiConfig}>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    {children}
  </WagmiProvider>
);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
