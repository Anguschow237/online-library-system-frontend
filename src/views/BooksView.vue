<template>
  <div>
    <!-- Books Section -->
    <div class="container-fluid my-4">
      <!-- Header row -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item d-flex align-items-center">
            <router-link to="/books" class="text-primary text-decoration-none me-2">
              Books
            </router-link>
            <span>/</span>
          </li>
        </ol>

        <!-- Only show Add button if user exists AND role === 'admin' -->
        <router-link v-if="user && user.role === 'admin'" to="/book/add" class="btn btn-primary">
          Add
        </router-link>
      </div>

      <!-- Books grid -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-if="books.length === 0" class="col">
          <div class="alert alert-secondary mb-0">No books found.</div>
        </div>

        <div v-for="book in books" :key="book._id" class="col">
          <div class="card">
            <router-link :to="`/book/detail/${book._id}`">
              <img
                :src="book.coverimage || '/placeholder.jpg'"
                class="card-img-top"
                alt="Book cover"
                style="height: 200px; object-fit: cover"
              />
            </router-link>
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text text-muted">{{ book.author }}</p>

              <!-- Action buttons -->
              <div class="text-end">
                <!-- Normal user: Borrow -->
                <router-link
                  v-if="user && user.role === 'user'"
                  :to="`/book/detail/${book._id}`"
                  class="btn btn-outline-success btn-sm"
                >
                  Borrow
                </router-link>

                <!-- Admin: Edit + Delete -->
                <router-link
                  v-if="user && user.role === 'admin'"
                  :to="`/book/edit/${book._id}`"
                  class="btn btn-outline-primary btn-sm me-2"
                >
                  Edit
                </router-link>
                <button
                  v-if="user && user.role === 'admin'"
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteBook(book._id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="pagination.totalPages > 1" aria-label="Page navigation" class="mt-4">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
            <button class="page-link" @click="goToPage(pagination.currentPage - 1)">
              Previous
            </button>
          </li>

          <li
            v-for="page in pages"
            :key="page"
            class="page-item"
            :class="{ active: page === pagination.currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: pagination.currentPage === pagination.totalPages }"
          >
            <button class="page-link" @click="goToPage(pagination.currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// --- navbar user state ---
const user = ref(null)

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decoded = jwtDecode(token)
      user.value = {
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
      }
    } catch (err) {
      console.error('Invalid token', err)
      user.value = null
    }
  } else {
    user.value = null
  }
})
// -------------------------

const books = ref([])
const pagination = ref({ total: 0, perPage: 6, totalPages: 1, currentPage: 1 })

const fetchBooks = async (page = 1) => {
  try {
    const res = await axios.get(`/api/books?page=${page}`)
    books.value = res.data.books || []
    pagination.value = res.data.pagination || {
      total: 0,
      perPage: 6,
      totalPages: 1,
      currentPage: 1,
    }
  } catch (err) {
    console.error('API error:', err)
  }
}

const pages = computed(() =>
  Array.from({ length: Math.max(1, Number(pagination.value.totalPages || 1)) }, (_, i) => i + 1),
)

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchBooks(page)
  }
}

const deleteBook = async (id) => {
  if (!confirm('Are you sure you want to delete this book?')) return
  try {
    await axios.delete(`/api/books/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    // Refresh list after deletion
    fetchBooks(pagination.value.currentPage)
  } catch (err) {
    console.error('Delete failed:', err)
    alert('Failed to delete book')
  }
}

onMounted(() => {
  fetchBooks(1)
})
</script>
