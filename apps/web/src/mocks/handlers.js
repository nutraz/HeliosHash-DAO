import { http, HttpResponse } from 'msw'

export const handlers = [
  // Add your mock API handlers here
  http.get('/api/auth/user', () => {
    return HttpResponse.json({
      id: 1,
      name: 'Demo User',
      email: 'demo@helioshash.org'
    })
  }),
  
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      token: 'demo-token-12345'
    })
  })
]
