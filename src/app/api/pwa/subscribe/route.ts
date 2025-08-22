import { NextRequest, NextResponse } from 'next/server'

// Armazenamento temporário das subscriptions (em produção, usar banco de dados)
const subscriptions = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()
    
    // Validar subscription
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Subscription inválida' },
        { status: 400 }
      )
    }

    // Armazenar subscription (em produção, salvar no banco)
    subscriptions.add(JSON.stringify(subscription))
    
    console.log('Nova subscription PWA:', subscription.endpoint)
    
    return NextResponse.json(
      { message: 'Subscription salva com sucesso' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao processar subscription:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json()
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint é obrigatório' },
        { status: 400 }
      )
    }

    // Remover subscription
    for (const sub of subscriptions) {
      const parsed = JSON.parse(sub)
      if (parsed.endpoint === endpoint) {
        subscriptions.delete(sub)
        break
      }
    }
    
    return NextResponse.json(
      { message: 'Subscription removida com sucesso' }
    )
  } catch (error) {
    console.error('Erro ao remover subscription:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    total: subscriptions.size,
    message: 'PWA Subscriptions API funcionando'
  })
}