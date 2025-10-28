import { Route, Switch } from 'wouter'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { config } from './lib/wagmi'
import GeneratorPage from './pages/GeneratorPage'
import TipPage from './pages/TipPage'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={GeneratorPage} />
          <Route path="/tip" component={TipPage} />
          <Route>
            {() => (
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600">ページが見つかりません</p>
                  <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                    トップページに戻る
                  </a>
                </div>
              </div>
            )}
          </Route>
        </Switch>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
