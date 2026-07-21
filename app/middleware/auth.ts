export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for public routes
  if (to.path === '/cek-tagihan' || to.path === '/login' || to.path === '/') {
    return
  }

  // Check if user is authenticated
  const { checkSession, isAuthenticated } = useAuth()
  
  const isLoggedIn = await checkSession()
  
  if (!isLoggedIn) {
    return navigateTo('/login')
  }
})
