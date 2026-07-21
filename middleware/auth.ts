export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for public routes
  if (to.path === '/cek-tagihan' || to.path === '/login') {
    return
  }

  // Check if user is authenticated
  const user = useSupabaseUser()
  
  if (!user.value) {
    return navigateTo('/login')
  }
})
