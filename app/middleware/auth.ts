export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for public routes
  if (to.path === '/cek-tagihan' || to.path === '/login' || to.path === '/') {
    return
  }

  // Check if user is authenticated (simplified for now)
  // In production, this should check Supabase auth
  const isAuthenticated = true // TODO: implement proper auth check

  if (!isAuthenticated) {
    return navigateTo('/login')
  }
})
