// ERC-20 Token Addresses on Polygon Mainnet
export const TOKEN_ADDRESSES = {
  JPYC: '0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c' as `0x${string}`,
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' as `0x${string}`,
} as const

// Token decimals
export const TOKEN_DECIMALS = {
  JPYC: 18,
  USDC: 6,
} as const

// Token information
export const TOKENS = [
  {
    symbol: 'JPYC',
    name: 'JPY Coin',
    address: TOKEN_ADDRESSES.JPYC,
    decimals: TOKEN_DECIMALS.JPYC,
    description: '日本円ステーブルコイン (1 JPYC = 1円)',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: TOKEN_ADDRESSES.USDC,
    decimals: TOKEN_DECIMALS.USDC,
    description: '米ドルステーブルコイン (1 USDC = 1ドル)',
  },
] as const

// Preset amounts for quick selection
export const PRESET_AMOUNTS = [10, 50, 100] as const

// ERC-20 ABI for transfer function
export const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const
