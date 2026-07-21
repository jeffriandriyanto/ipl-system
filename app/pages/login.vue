<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-primary-600">IPL System</h1>
          <p class="text-gray-500 mt-2">Login ke panel admin</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Login' }}
          </button>
        </form>

        <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const { login, checkSession } = useAuth()

// Check if already logged in
onMounted(async () => {
  const isLoggedIn = await checkSession()
  if (isLoggedIn) {
    await navigateTo('/admin')
  }
})

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await login(form.email, form.password)
    await navigateTo('/admin')
  } catch (err) {
    error.value = err.message || 'Email atau password salah'
  } finally {
    loading.value = false
  }
}
</script>
