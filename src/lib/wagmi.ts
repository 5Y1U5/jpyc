import { http, createConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Polygon Mainnet configuration
export const config = createConfig({
  chains: [polygon],
  connectors: [
    injected(),
  ],
  transports: {
    [polygon.id]: http(),
  },
})
