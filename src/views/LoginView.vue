<template>
  <div>
    <!-- Login box -->
    <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh">
      <div class="card shadow-sm" style="width: 400px">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Sign in</h3>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <div class="form-check mb-3">
              <input
                type="checkbox"
                class="form-check-input"
                id="rememberMe"
                v-model="rememberMe"
              />
              <label class="form-check-label" for="rememberMe">Remember me</label>
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign in</button>
          </form>
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../composables/useAuth'
const { setUser } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref(null)
const router = useRouter()

async function handleLogin() {
  error.value = null
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    if (!res.ok) throw new Error('Invalid credentials')

    const data = await res.json()

    // store token
    localStorage.setItem('token', data.token)

    // store user object (firstName, lastName, role, etc.)
    localStorage.setItem('user', JSON.stringify(data.user))

    // optional: still store role separately if you want
    localStorage.setItem('role', data.user.role)

    // inside handleLogin
    setUser({ ...data.user, token: data.token })
    router.push('/')
  } catch (err) {
    error.value = err.message
  }
}
</script>
