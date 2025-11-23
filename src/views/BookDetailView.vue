<template>
  <div>
    <!-- Navbar -->

    <div class="container-fluid my-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/books" class="text-primary">Book</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ book?.title || 'Untitled' }}
          </li>
        </ol>
      </nav>

      <!-- Two-column layout -->
      <div class="row">
        <!-- Left: Book Info -->
        <div :class="user && user.role === 'admin' ? 'col-lg-6' : 'col-12'">
          <div v-if="book" class="card">
            <img
              :src="book.coverimage || '/placeholder.jpg'"
              class="card-img-top"
              alt="Book image"
              style="max-height: 360px; object-fit: cover"
              @error="onImageError"
            />
            <div class="card-body">
              <h4 class="card-title mb-2">{{ book.title || 'Untitled' }}</h4>
              <p class="text-muted mb-3">{{ book.description || '' }}</p>
              <table class="table table-sm">
                <tbody>
                  <tr>
                    <td class="fw-semibold">ISBN</td>
                    <td>{{ book.isbn || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">Author</td>
                    <td>{{ book.author || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">Publisher</td>
                    <td>{{ book.publisher || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">Year</td>
                    <td>{{ book.year || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">Category</td>
                    <td>{{ book.category || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">Location</td>
                    <td>{{ book.location || '-' }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Borrow status (admin only) -->
              <div class="mt-3" v-if="user && user.role === 'admin' && currentBorrow">
                <span class="badge bg-warning text-dark">Borrowed</span>
              </div>

              <!-- Action buttons -->
              <div class="mt-3">
                <button
                  v-if="user && user.role === 'user' && !userHasBorrowed"
                  class="btn btn-primary me-2"
                  @click="borrowBook"
                >
                  Borrow
                </button>
                <button
                  v-if="user && user.role === 'user' && userHasBorrowed"
                  class="btn btn-warning me-2"
                  @click="returnBook"
                >
                  Return
                </button>

                <router-link
                  v-if="user && user.role === 'admin'"
                  :to="`/book/edit/${book._id}`"
                  class="btn btn-secondary me-2"
                >
                  Edit
                </router-link>
                <button
                  v-if="user && user.role === 'admin'"
                  class="btn btn-danger"
                  @click="deleteBook"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        </div>

        <!-- Right: Borrow History -->
        <div v-if="user && user.role === 'admin'" class="col-lg-6">
          <h5>Borrow History</h5>
          <table class="table table-bordered table-sm">
            <thead>
              <tr>
                <th>Email</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in borrowHistory" :key="record.email + record.borrowDate">
                <td>{{ record.email }}</td>
                <td>{{ record.borrowDate }}</td>
                <td>{{ record.returnDate }}</td>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

const route = useRoute()
const book = ref(null)
const currentBorrow = ref(null)
const borrowHistory = ref([])
const pagination = ref({ total: 0, totalPages: 1, currentPage: 1, perPage: 5 })
const user = ref(null)
const error = ref(null)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      user.value = jwtDecode(token)
    } catch (e) {
      console.error('Invalid token', e)
    }
  }

  try {
    const res = await axios.get(`/api/books/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    book.value = res.data.book
    currentBorrow.value = res.data.currentBorrow
    if (user.value?.role === 'admin') {
      await loadHistory(1)
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load book'
  }
})

const userHasBorrowed = computed(() => {
  if (!user.value || !currentBorrow.value) return false
  return currentBorrow.value.userId === user.value._id
})

const borrowBook = async () => {
  try {
    await axios.post(
      `/api/books/${route.params.id}/borrow`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    )
    window.location.reload()
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    alert('Borrow failed')
  }
}

const returnBook = async () => {
  try {
    await axios.post(
      `/api/books/${route.params.id}/return`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    )
    window.location.reload()
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    alert('Return failed')
  }
}

const deleteBook = async () => {
  if (!confirm('Delete this book?')) return
  try {
    await axios.delete(`/api/books/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    window.location.href = '/books'
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    alert('Delete failed')
  }
}

const loadHistory = async (page) => {
  try {
    const res = await axios.get(
      `/api/books/${route.params.id}/borrow-history?page=${page}&limit=${pagination.value.perPage}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
    )
    borrowHistory.value = res.data.history.map((r) => ({
      email: r.email,
      borrowDate: r.borrowDate ? new Date(r.borrowDate).toLocaleDateString() : '-',
      returnDate: r.returnDate ? new Date(r.returnDate).toLocaleDateString() : '-',
    }))
    pagination.value = res.data.pagination
  } catch (err) {
    console.error('Failed to load history', err)
  }
}

const pages = computed(() => Array.from({ length: pagination.value.totalPages }, (_, i) => i + 1))

const onImageError = (e) => {
  e.target.src = '/placeholder.jpg'
}
</script>
