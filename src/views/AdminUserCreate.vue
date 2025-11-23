<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)
const form = ref({ password: '' })

const passwordStrengthText = computed(() => {
  const pwd = form.value.password
  if (!pwd) return ''
  if (pwd.length < 6) return 'Weak'
  if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return 'Strong'
  return 'Medium'
})

const passwordStrengthClass = computed(() => {
  switch (passwordStrengthText.value) {
    case 'Weak':
      return 'text-danger'
    case 'Medium':
      return 'text-warning'
    case 'Strong':
      return 'text-success'
    default:
      return ''
  }
})

const passwordsDontMatch = computed(
  () =>
    form.value.password &&
    form.value.confirmPassword &&
    form.value.password !== form.value.confirmPassword,
)

async function submitForm() {
  if (passwordsDontMatch.value) return
  isSubmitting.value = true

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        role: form.value.role.toLowerCase(),
      }),
    })

    if (!res.ok) throw new Error('Failed to create user')
    await res.json()
    router.push('/admin/users')
  } catch (err) {
    alert(err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#" @click.prevent="$router.go(-1)">Users</a>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Add</li>
      </ol>
    </nav>

    <form @submit.prevent="submitForm">
      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control form-control-sm"
          id="email"
          name="createEmail"
          v-model="form.email"
          autocomplete="off"
          required
          placeholder="xxx@life.hkbu.edu.hk"
        />
      </div>

      <!-- Password -->
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control form-control-sm"
          id="password"
          name="createPassword"
          v-model="form.password"
          autocomplete="new-password"
          required
        />
        <!-- Strength indicator -->
        <div v-if="passwordStrengthText" class="mt-1">
          <small :class="passwordStrengthClass">{{ passwordStrengthText }}</small>
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          type="password"
          class="form-control form-control-sm"
          id="confirmPassword"
          name="createConfirmPassword"
          v-model="form.confirmPassword"
          autocomplete="new-password"
          required
        />
        <div v-if="passwordsDontMatch" class="text-danger small mt-1">Passwords do not match</div>
      </div>

      <!-- First Name -->
      <div class="mb-3">
        <label for="firstName" class="form-label">First Name</label>
        <input
          type="text"
          class="form-control form-control-sm"
          id="firstName"
          name="createFirstName"
          v-model="form.firstName"
          autocomplete="off"
          required
        />
      </div>

      <!-- Last Name -->
      <div class="mb-3">
        <label for="lastName" class="form-label">Last Name</label>
        <input
          type="text"
          class="form-control form-control-sm"
          id="lastName"
          name="createLastName"
          v-model="form.lastName"
          autocomplete="off"
          required
        />
      </div>

      <!-- Role -->
      <div class="mb-3">
        <label class="form-label me-3">Role</label>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            id="roleUser"
            value="User"
            v-model="form.role"
            name="createRole"
          />
          <label class="form-check-label" for="roleUser">User</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            id="roleAdmin"
            value="Admin"
            v-model="form.role"
            name="createRole"
          />
          <label class="form-check-label" for="roleAdmin">Admin</label>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-4">
        <button
          type="submit"
          class="btn btn-primary px-4"
          :disabled="isSubmitting || passwordsDontMatch"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          Save
        </button>
        <button type="button" class="btn btn-link ms-3" @click="$router.go(-1)">Cancel</button>
      </div>
    </form>
  </div>
</template>
