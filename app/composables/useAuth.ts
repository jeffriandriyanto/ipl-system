export const useAuth = () => {
  const user = useSupabaseUser()
  const supabase = useSupabase()

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    user.value = data.user
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    await navigateTo('/login')
  }

  const isAuthenticated = computed(() => !!user.value)

  // Check session on mount
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      user.value = session.user
    }
    return !!session
  }

  return {
    user,
    login,
    logout,
    isAuthenticated,
    checkSession
  }
}
