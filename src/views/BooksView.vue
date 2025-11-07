<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Online Library</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" to="/books">Books</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search">Search</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Books Section -->
    <div class="container-fluid my-4">
      <!-- Header row -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item d-flex align-items-center">
            <router-link to="/books" class="text-primary text-decoration-none me-2"
              >Books</router-link>
            <span>/</span>
          </li>
        </ol>
        <router-link to="/book/add" class="btn btn-primary">Add</router-link>
      </div>

      <!-- Books grid (dynamic height by description) -->
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
              <p class="card-text text-muted">{{ book.description }}</p>
              <div class="text-end">
                <router-link :to="`/book/edit/${book._id}`" class="btn btn-outline-primary btn-sm">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

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

onMounted(() => {
  fetchBooks(1)
})
</script>
