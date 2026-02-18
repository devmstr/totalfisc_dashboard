import { NextResponse } from 'next/server'

export function getTenantId(request: Request): string | null {
  const tenantId = request.headers.get('X-Tenant-Id')
  return tenantId
}

export function unauthorizedResponse(message: string = 'Tenant ID is required') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}
