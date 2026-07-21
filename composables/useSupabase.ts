import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  return supabase
}

export const useSupabaseUser = () => {
  const user = useState('supabase-user', () => null)
  return user
}
