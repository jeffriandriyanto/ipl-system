<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-primary-600">IPL System</h1>
          <p class="text-gray-500 mt-2">Login ke panel admin</p>
        </div>

        <UForm :state="form" @submit="handleLogin" class="space-y-4">
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="email@example.com"
              icon="i-lucide-mail"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
            />
          </UFormGroup>

          <UButton
            type="submit"
            label="Login"
            :loading="loading"
            block
          />
        </UForm>

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

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    // API call to login
    // This will be implemented with Supabase Auth
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password
      }
    })

    if (response.success) {
      await navigateTo('/admin')
    } else {
      error.value = response.message || 'Login gagal'
    }
  } catch (err) {
    error.value = 'Email atau password salah'
  } finally {
    loading.value = false
  }
}
</script>
