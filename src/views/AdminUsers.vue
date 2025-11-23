<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()
const router = useRouter()

const users = ref([])
const pagination = ref({ total: 0, totalPages: 0, currentPage: 1, perPage: 6 })
const keyword = ref('')
const sortBy = ref('createdAt')
const sortOrder = ref('desc')

async function fetchUsers(page = 1) {
  const res = await fetch(
    `/api/users?page=${page}&limit=${pagination.value.perPage}&keyword=${keyword.value}&sortBy=${sortBy.value}&sortOrder=${sortOrder.value}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  )
  if (res.ok) {
    const data = await res.json()
    users.value = data.users
    pagination.value = data.pagination
  }
}

function editUser(user) {
  router.push(`/admin/users/edit/${user._id}`)
}

function createUser() {
  router.push('/admin/users/create')
}

function goToPage(page) {
  pagination.value.currentPage = page
  fetchUsers(page)
}

onMounted(() => {
  if (!user.value || user.value.role !== 'admin') {
    router.push('/')
  } else {
    fetchUsers()
  }
})
</script>

<template>
  <div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active">Users</li>
      </ol>
    </nav>

    <!-- Search + Add -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <input
        v-model="keyword"
        @keyup.enter="fetchUsers(1)"
        type="text"
        class="form-control me-2"
        placeholder="Search users..."
        style="max-width: 300px"
      />
      <button class="btn btn-primary" @click="createUser">Add</button>
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.email }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.role }}</td>
            <td>
              <a href="#" @click.prevent="editUser(user)">Edit</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(pagination.currentPage - 1)">Previous</a>
        </li>
        <li
          v-for="page in pagination.totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === pagination.currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(pagination.currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
