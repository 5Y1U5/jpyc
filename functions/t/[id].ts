// Cloudflare Pages Function for short URL redirects
// Route: /t/:id
// 
// This function redirects /t/:id to /tip.html?d=:base64data
// The mapping is stored in Cloudflare KV (SHORT_URLS namespace)
// 
// For local development without KV:
// - The function returns a client-side redirect page that checks localStorage
// - This allows testing without setting up KV locally

interface Env {
  SHORT_URLS?: KVNamespace;
}

export async function onRequest(context: { params: { id: string }; env: Env; request: Request }): Promise<Response> {
  const { params, env } = context;
  const shortId = params.id;
  
  try {
    // Try to get full URL from KV store (production)
    if (env.SHORT_URLS) {
      const encodedData = await env.SHORT_URLS.get(shortId);
      
      if (encodedData) {
        // Redirect to tip page with encoded data
        return new Response(null, {
          status: 302,
          headers: {
            'Location': `/tip.html?d=${encodedData}`,
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    }
    
    // Fallback: Return HTML page that checks localStorage (development/demo)
    // This allows the system to work without KV setup
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>リダイレクト中...</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
        <div class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <p class="text-lg text-gray-700">リダイレクト中...</p>
    </div>
    
    <script>
        const shortId = '${shortId}';
        const encodedData = localStorage.getItem('shorturl_' + shortId);
        
        if (encodedData) {
            // Redirect to tip page
            window.location.href = '/tip.html?d=' + encodedData;
        } else {
            // Not found
            document.body.innerHTML = \`
                <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
                    <div class="text-center space-y-4 max-w-md">
                        <div class="text-6xl">❌</div>
                        <h1 class="text-2xl font-bold text-gray-800">短縮URLが見つかりません</h1>
                        <p class="text-gray-600">このリンクは無効か、期限切れの可能性があります。</p>
                        <a href="/" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            ホームに戻る
                        </a>
                    </div>
                </div>
            \`;
        }
    </script>
</body>
</html>
    `;
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Error handling short URL:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
}
