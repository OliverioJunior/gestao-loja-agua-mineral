import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

// Configurar VAPID keys (em produção, usar variáveis de ambiente)
const vapidKeys = {
  publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9LdNnC_NNPB6Pv0nkpT7QjVpRgJI5xJSHSRec-AUcycfkHHfHCao',
  privateKey: 'UzxBjkuW8JVEMGce5rZ6dF8X9o2PVK3L4N6M7Q8R9S0T'
}

webpush.setVapidDetails(
  'mailto:admin@aquagestao.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// Armazenamento temporário (mesmo do subscribe)
const subscriptions = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const { title, body, icon, url, data } = await request.json()
    
    if (!title || !body) {
      return NextResponse.json(
        { error: 'Título e corpo são obrigatórios' },
        { status: 400 }
      )
    }

    const payload = JSON.stringify({
      title: title || 'AquaGestão',
      body,
      icon: icon || '/icon-192x192.svg',
      badge: '/icon-192x192.svg',
      url: url || '/',
      data: data || {},
      actions: [
        {
          action: 'open',
          title: 'Abrir Sistema'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    })

    const promises = []
    let successCount = 0
    let errorCount = 0

    // Enviar para todas as subscriptions
    for (const subString of subscriptions) {
      try {
        const subscription = JSON.parse(subString)
        const promise = webpush.sendNotification(subscription, payload)
          .then(() => {
            successCount++
          })
          .catch((error) => {
            console.error('Erro ao enviar notificação:', error)
            errorCount++
            // Remover subscription inválida
            if (error.statusCode === 410) {
              subscriptions.delete(subString)
            }
          })
        
        promises.push(promise)
      } catch (parseError) {
        console.error('Erro ao parsear subscription:', parseError)
        subscriptions.delete(subString)
        errorCount++
      }
    }

    await Promise.all(promises)

    return NextResponse.json({
      message: 'Notificações enviadas',
      sent: successCount,
      errors: errorCount,
      total: subscriptions.size
    })

  } catch (error) {
    console.error('Erro ao enviar notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para testar notificações
export async function GET() {
  try {
    // Enviar notificação de teste
    const testPayload = JSON.stringify({
      title: 'AquaGestão - Teste',
      body: 'Sistema PWA funcionando perfeitamente! 💧📊',
      icon: '/icon-192x192.svg',
      badge: '/icon-192x192.svg',
      url: '/',
      data: {
        type: 'test',
        timestamp: Date.now()
      }
    })

    let sent = 0
    for (const subString of subscriptions) {
      try {
        const subscription = JSON.parse(subString)
        await webpush.sendNotification(subscription, testPayload)
        sent++
      } catch (error) {
        console.error('Erro no teste:', error)
      }
    }

    return NextResponse.json({
      message: 'Notificação de teste enviada',
      sent,
      total: subscriptions.size
    })
  } catch (error) {
    console.error('Erro no teste:', error)
    return NextResponse.json(
      { error: 'Erro no teste' },
      { status: 500 }
    )
  }
}