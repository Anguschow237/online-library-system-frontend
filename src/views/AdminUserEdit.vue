<template>
  <div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#" @click.prevent="$router.push('/admin/users')">Users</a>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Edit</li>
      </ol>
    </nav>

    <div class="row">
      <!-- Left: Form -->
      <div class="col-md-6">
        <form @submit.prevent="handleUpdate">
          <div class="mb-3">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              name="editEmail"
              autocomplete="off"
              required
            />
          </div>
          <div class="mb-3">
            <label>First Name</label>
            <input
              v-model="firstName"
              type="text"
              class="form-control"
              name="editFirstName"
              autocomplete="off"
              required
            />
          </div>
          <div class="mb-3">
            <label>Last Name</label>
            <input
              v-model="lastName"
              type="text"
              class="form-control"
              name="editLastName"
              autocomplete="off"
              required
            />
          </div>
          <div class="mb-3">
            <label>Role</label>
            <select v-model="role" class="form-select" name="editRole" autocomplete="off">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="mb-3">
            <label>Password (leave blank to keep current)</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              name="editPassword"
              autocomplete="new-password"
            />
          </div>
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" class="btn btn-danger ms-2" @click="handleDelete">Delete</button>
        </form>

        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-3">{{ success }}</div>
      </div>

      <!-- Right: Borrow History -->
      <div class="col-md-6">
        <h5>Borrow History</h5>
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in borrowHistory" :key="record.title + record.borrowDate">
              <td>{{ record.title }}</td>
              <td>{{ new Date(record.borrowDate).toLocaleDateString() }}</td>
              <td>
                {{ record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '-' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav v-if="pagination.totalPages > 1">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
              <button class="page-link" @click="loadHistory(pagination.currentPage - 1)">
                Previous
              </button>
            </li>
            <li
              v-for="page in pages"
              :key="page"
              class="page-item"
              :class="{ active: page === pagination.currentPage }"
            >
              <button class="page-link" @click="loadHistory(page)">{{ page }}</button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: pagination.currentPage === pagination.totalPages }"
            >
              <button class="page-link" @click="loadHistory(pagination.currentPage + 1)">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const role = ref('user')
const password = ref('')
const error = ref(null)
const success = ref(null)

const borrowHistory = ref([])
const pagination = ref({ currentPage: 1, totalPages: 1 })
const pages = ref([])

async function fetchUser() {
  try {
    const res = await fetch(`/api/users/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!res.ok) throw new Error('Failed to load user')
    const data = await res.json()
    email.value = data.email
    firstName.value = data.firstName
    lastName.value = data.lastName
    role.value = data.role
  } catch (err) {
    error.value = err.message
  }
}

async function loadHistory(page = 1) {
  try {
    const res = await fetch(`/api/users/${route.params.id}/borrow-history?page=${page}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!res.ok) throw new Error('Failed to load borrow history')
    const data = await res.json()
    borrowHistory.value = data.records
    pagination.value = {
      currentPage: data.currentPage,
      totalPages: data.totalPages,
    }
    pages.value = Array.from({ length: data.totalPages }, (_, i) => i + 1)
  } catch (err) {
    error.value = err.message
  }
}

async function handleUpdate() {
  error.value = null
  success.value = null
  try {
    const res = await fetch(`/api/users/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        role: role.value,
        ...(password.value ? { password: password.value } : {}),
      }),
    })
    if (!res.ok) throw new Error('Failed to update user')
    await res.json()
    router.push('/admin/users')
  } catch (err) {
    error.value = err.message
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    const res = await fetch(`/api/users/${route.params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    if (!res.ok) throw new Error('Failed to delete user')
    await res.json()
    router.push('/admin/users')
  } catch (err) {
    error.value = err.message
  }
}

onMounted(() => {
  fetchUser()
  loadHistory()
})
</script>
