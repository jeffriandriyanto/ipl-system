export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for public routes
  if (to.path === '/cek-tagihan' || to.path === '/login' || to.path === '/') {
    return
  }

  // For now, allow all admin routes
  // TODO: implement proper auth check
})
