import { createClient } from '@supabase/supabase-js'

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function seedAuthUser() {
  console.log('🌱 Seeding Supabase Auth user...')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
    console.log('\nTo get service_role key:')
    console.log('1. Go to Supabase Dashboard')
    console.log('2. Settings → API')
    console.log('3. Copy "service_role" key (NOT anon key)')
    console.log('\nThen add to .env:')
    console.log('SUPABASE_SERVICE_ROLE_KEY=eyJxxx...')
    process.exit(1)
  }

  // Use service role key for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const email = 'admin@ipl-waris1.com'
  const password = 'waris123!'

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    if (existingUser) {
      console.log(`✅ User ${email} already exists, updating password...`)
      
      // Update password
      const { error } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password }
      )

      if (error) {
        throw error
      }

      console.log(`✅ Password updated for ${email}`)
    } else {
      console.log(`Creating user ${email}...`)
      
      // Create user
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nama: 'Admin IPL Waris 1',
          role: 'admin',
          tenant_id: 'waris1'
        }
      })

      if (error) {
        throw error
      }

      console.log(`✅ User created: ${email}`)
      console.log(`   User ID: ${data.user?.id}`)
    }

    console.log('\n🎉 Auth user seeded successfully!')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
  } catch (error: any) {
    console.error('❌ Error seeding auth user:', error.message)
    process.exit(1)
  }
}

seedAuthUser()
