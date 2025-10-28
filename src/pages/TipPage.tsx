import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { Wallet, Send, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TOKENS, PRESET_AMOUNTS, ERC20_ABI } from '../lib/constants'
import { validateAmount } from '../utils/validation'
import { loadAvatar } from '../utils/localStorage'
import { toast } from 'sonner'

export default function TipPage() {
  const [, navigate] = useLocation()
  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState<`0x${string}` | ''>('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<typeof TOKENS[number]>(TOKENS[0])
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')

  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { data: hash, writeContract, isPending: isWritePending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('name')
    const addr = params.get('address')
    const avatarKey = params.get('avatarKey')

    if (!name || !addr) {
      toast.error('無効なURLです')
      navigate('/')
      return
    }

    setRecipientName(name)
    setRecipientAddress(addr as `0x${string}`)

    // Load avatar from localStorage if available
    if (avatarKey) {
      const avatar = loadAvatar(avatarKey)
      if (avatar) {
        setAvatarUrl(avatar)
      }
    }
  }, [navigate])

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      toast.success(
        <div className="space-y-2">
          <p className="font-semibold">投げ銭を送りました！</p>
          <a
            href={`https://polygonscan.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            Polygonscanで確認
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )
      setAmount('')
      setCustomAmount('')
    }
  }, [isConfirmed, hash])

  const handleConnect = () => {
    const connector = connectors[0] // Use first connector (injected/MetaMask)
    if (connector) {
      connect({ connector })
    }
  }

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString())
    setCustomAmount('')
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    setAmount(value)
  }

  const handleSendTip = async () => {
    if (!isConnected) {
      toast.error('ウォレットを接続してください')
      return
    }

    const amountError = validateAmount(amount)
    if (amountError) {
      toast.error(amountError)
      return
    }

    try {
      const amountInWei = parseUnits(amount, selectedToken.decimals)

      writeContract({
        address: selectedToken.address,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipientAddress, amountInWei],
      })
    } catch (error) {
      console.error('Transaction error:', error)
      toast.error('トランザクションの送信に失敗しました')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isProcessing = isWritePending || isConfirming

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              {avatarUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                  <img
                    src={avatarUrl}
                    alt={recipientName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {getInitials(recipientName)}
                </div>
              )}
            </div>

            <div>
              <CardTitle className="text-2xl">{recipientName}</CardTitle>
              <CardDescription className="mt-2">
                暗号資産で投げ銭を送る
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Wallet Connection */}
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                className="w-full"
                size="lg"
              >
                <Wallet className="w-5 h-5 mr-2" />
                MetaMaskで接続
              </Button>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              </div>
            )}

            {/* Token Selection */}
            <div className="space-y-2">
              <Label>通貨を選択</Label>
              <div className="grid grid-cols-2 gap-3">
                {TOKENS.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => setSelectedToken(token)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedToken.symbol === token.symbol
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg">{token.symbol}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {token.name}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {selectedToken.description}
              </p>
            </div>

            {/* Preset Amounts */}
            <div className="space-y-2">
              <Label>金額を選択</Label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AMOUNTS.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? 'default' : 'outline'}
                    onClick={() => handlePresetAmount(preset)}
                    disabled={isProcessing}
                  >
                    {preset} {selectedToken.symbol}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">カスタム金額</Label>
              <div className="relative">
                <Input
                  id="custom-amount"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="金額を入力"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  disabled={isProcessing}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                  {selectedToken.symbol}
                </div>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendTip}
              disabled={!isConnected || !amount || isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  処理中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  投げ銭を送る
                </>
              )}
            </Button>

            {/* Transaction Hash */}
            {hash && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  トランザクションハッシュ
                </div>
                <a
                  href={`https://polygonscan.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 break-all"
                >
                  {hash}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            )}

            {/* Network Info */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              Polygon Mainnet上で動作しています
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
