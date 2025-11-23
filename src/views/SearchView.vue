<template>
  <div class="container-fluid my-4">
    <!-- Header row -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item d-flex align-items-center">
          <router-link to="/search" class="text-primary text-decoration-none me-2"
            >Search</router-link
          >
          <span>/</span>
        </li>
      </ol>
    </div>

    <div class="row">
      <!-- Results grid on the left -->
      <div class="col-md-9">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-if="books.length === 0" class="col">
            <div class="alert alert-warning mb-0">No results found.</div>
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
                <p class="card-text text-muted">{{ book.description }}</p>
                <div class="text-end">
                  <router-link
                    :to="`/book/detail/${book._id}`"
                    class="btn btn-outline-primary btn-sm"
                  >
                    View
                  </router-link>

                  <!-- Only show Edit if logged in AND role === 'admin' -->
                  <router-link
                    v-if="user && user.role === 'admin'"
                    :to="`/book/edit/${book._id}`"
                    class="btn btn-outline-secondary btn-sm ms-2"
                  >
                    Edit
                  </router-link>
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

      <!-- Search panel on the right -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-header bg-light text-secondary">Search</div>
          <div class="card-body">
            <form @submit.prevent="doSearch">
              <!-- Keywords -->
              <div class="mb-3">
                <label for="keyword" class="form-label">Keywords</label>
                <input
                  id="keyword"
                  v-model="filters.keyword"
                  type="text"
                  class="form-control"
                  placeholder="Enter keywords"
                />
              </div>

              <!-- Category -->
              <div class="mb-3">
                <label for="category" class="form-label">Category</label>
                <select id="category" v-model="filters.category" class="form-select">
                  <option value="">Choose...</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <!-- Location -->
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <select id="location" v-model="filters.location" class="form-select">
                  <option value="">Choose...</option>
                  <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                </select>
              </div>

              <!-- Search button -->
              <button type="submit" class="btn btn-primary w-100">Search</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
    }
  }
})
// -------------------------

const route = useRoute()
const router = useRouter()

const books = ref([])
const pagination = ref({ total: 0, perPage: 6, totalPages: 1, currentPage: 1 })
const filters = ref({
  keyword: route.query.keyword || '',
  category: route.query.category || '',
  location: route.query.location || '',
  sortBy: route.query.sortBy || 'createdAt',
  sortOrder: route.query.sortOrder || 'desc',
  page: parseInt(route.query.page) || 1,
  limit: 6,
})

const categories = [
  'Science',
  'Technology',
  'Engineering',
  'Mathematics',
  'Arts',
  'Literature',
  'History',
  'Geography',
  'Philosophy',
  'Psychology',
  'Sociology',
  'Economics',
  'Business',
  'Law',
  'Medicine',
  'Health',
  'Education',
  'Politics',
  'Religion',
  'Environment',
]

const locations = [
  'Shelf A1',
  'Shelf A2',
  'Shelf A3',
  'Shelf B1',
  'Shelf B2',
  'Shelf B3',
  'Shelf C1',
  'Shelf C2',
  'Shelf C3',
]

const fetchBooks = async (page = 1) => {
  try {
    const res = await axios.get('/api/books', {
      params: { ...filters.value, page, limit: filters.value.limit },
    })
    books.value = res.data.books || []
    pagination.value = res.data.pagination || {
      total: 0,
      perPage: filters.value.limit,
      totalPages: 1,
      currentPage: page,
    }
  } catch (err) {
    console.error('API error:', err)
  }
}

const doSearch = () => {
  filters.value.page = 1
  router.push({ path: '/search', query: { ...filters.value } })
  fetchBooks(1)
}

const pages = computed(() =>
  Array.from({ length: Math.max(1, Number(pagination.value.totalPages || 1)) }, (_, i) => i + 1),
)

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    filters.value.page = page
    router.push({ path: '/search', query: { ...filters.value, page } })
    fetchBooks(page)
  }
}

onMounted(() => {
  fetchBooks(filters.value.page)
})
</script>
