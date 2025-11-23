import { ref } from 'vue'

const user = ref(null)

export function useAuth() {
  function setUser(u) {
    user.value = u
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', u.token)
  }

  function clearUser() {
    user.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  return { user, setUser, clearUser }
}
