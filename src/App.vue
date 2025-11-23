<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const { user, clearUser } = useAuth()
const router = useRouter()

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

function logout() {
  clearUser()
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Online Library</router-link>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/" active-class="active" exact-active-class="active"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/books"
                active-class="active"
                exact-active-class="active"
                >Books</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/search"
                active-class="active"
                exact-active-class="active"
                >Search</router-link
              >
            </li>
            <li v-if="user && user.role === 'admin'" class="nav-item">
              <router-link class="nav-link" to="/admin/users">Users</router-link>
            </li>
          </ul>
          <div class="d-flex">
            <template v-if="user">
              <span class="navbar-text me-3">{{ user.firstName }} {{ user.lastName }}</span>
              <button class="btn btn-outline-danger" @click="logout">Logout</button>
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn-primary">Sign in</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <router-view />
  </div>
</template>

<style scoped>
/* optional styling */
</style>
