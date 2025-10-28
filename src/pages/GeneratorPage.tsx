import { useState } from 'react'
import { Upload, Copy, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { validateName, validateWalletAddress } from '../utils/validation'
import { fileToDataUrl, validateImageFile, saveAvatar } from '../utils/localStorage'
import { toast } from 'sonner'

export default function GeneratorPage() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [embedCode, setEmbedCode] = useState('')
  const [directUrl, setDirectUrl] = useState('')
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)
      const dataUrl = await fileToDataUrl(file)
      setAvatarPreview(dataUrl)
      toast.success('画像をアップロードしました')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '画像のアップロードに失敗しました')
      e.target.value = ''
    }
  }

  const generateCode = () => {
    const nameError = validateName(name)
    const addressError = validateWalletAddress(address)

    if (nameError) {
      toast.error(nameError)
      return
    }

    if (addressError) {
      toast.error(addressError)
      return
    }

    // Save avatar to localStorage if uploaded
    let avatarKey = ''
    if (avatarPreview && address) {
      try {
        saveAvatar(address, avatarPreview)
        avatarKey = address.toLowerCase()
        toast.success('アバター画像を保存しました')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'アバター画像の保存に失敗しました')
      }
    }

    // Generate URLs
    const baseUrl = window.location.origin
    const params = new URLSearchParams({
      name: name,
      address: address,
      ...(avatarKey && { avatarKey: avatarKey }),
    })
    const tipUrl = `${baseUrl}/tip?${params.toString()}`

    // Generate embed code
    const iframe = `<iframe src="${tipUrl}" width="100%" height="600" style="border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>`

    setEmbedCode(iframe)
    setDirectUrl(tipUrl)
    toast.success('埋め込みコードを生成しました')
  }

  const copyToClipboard = async (text: string, type: 'embed' | 'url') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'embed') {
        setCopiedEmbed(true)
        setTimeout(() => setCopiedEmbed(false), 2000)
      } else {
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
      }
      toast.success('コピーしました')
    } catch (error) {
      toast.error('コピーに失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JPYC投げ銭システム
          </h1>
          <p className="text-gray-600 text-lg">
            暗号資産で簡単に投げ銭を受け取れる埋め込みコードを生成
          </p>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>受取人情報の入力</CardTitle>
            <CardDescription>
              投げ銭を受け取る方の情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">
                表示名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="例: クリエイター太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-gray-500">
                投げ銭ページに表示される名前（最大50文字）
              </p>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <Label htmlFor="address">
                ウォレットアドレス <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Polygon Mainnetのウォレットアドレス
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label htmlFor="avatar">アバター画像（任意）</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, GIF, WebP形式（最大5MB）
                  </p>
                </div>
                {avatarPreview && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateCode}
              className="w-full"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              埋め込みコードを生成
            </Button>
          </CardContent>
        </Card>

        {/* Generated Code */}
        {embedCode && (
          <Card>
            <CardHeader>
              <CardTitle>生成された埋め込みコード</CardTitle>
              <CardDescription>
                以下のコードをWebサイトに貼り付けてください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Embed Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>埋め込みコード（iframe）</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(embedCode, 'embed')}
                  >
                    {copiedEmbed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        コピー完了
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        コピー
                      </>
                    )}
                  </Button>
                </div>
                <textarea
                  readOnly
                  value={embedCode}
                  className="w-full h-24 p-3 text-sm font-mono bg-gray-50 border border-gray-200 rounded-md resize-none"
                />
              </div>

              {/* Direct URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>直接URL</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(directUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      プレビュー
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(directUrl, 'url')}
                    >
                      {copiedUrl ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          コピー完了
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          コピー
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <Input
                  readOnly
                  value={directUrl}
                  className="font-mono text-sm"
                />
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>プレビュー</Label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={directUrl}
                    className="w-full h-[600px] border-none"
                    title="Preview"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
