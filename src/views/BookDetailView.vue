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
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid my-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/books">Book</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ book.title || 'Untitled' }}
          </li>
        </ol>
      </nav>

      <div class="card" v-if="book">
        <img
          :src="book.coverimage"
          loading="lazy"
          class="card-img-top"
          alt="Book image"
          style="max-height:360px; object-fit:cover;"
          @error="onImageError"
        />

        <div class="card-body">
          <h4 class="card-title mb-2">{{ book.title || 'Untitled' }}</h4>
          <p class="text-muted mb-3">{{ book.description || '' }}</p>

          <table class="table table-sm">
            <tbody>
              <tr><td class="fw-semibold">ISBN</td><td>{{ book.isbn || '-' }}</td></tr>
              <tr><td class="fw-semibold">Author</td><td>{{ book.author || '-' }}</td></tr>
              <tr><td class="fw-semibold">Publisher</td><td>{{ book.publisher || '-' }}</td></tr>
              <tr><td class="fw-semibold">Year</td><td>{{ book.year || '-' }}</td></tr>
              <tr><td class="fw-semibold">Category</td><td>{{ book.category || '-' }}</td></tr>
            </tbody>
          </table>

          <div class="mt-3">
            <template v-if="currentBorrow">
              <span class="badge bg-warning text-dark">Borrowed</span>
              <span class="ms-2">
                by <strong>{{ currentBorrow.borrowerName }}</strong>
                ({{ currentBorrow.borrowerType }})
              </span>
            </template>
            <template v-else>
              <span class="badge bg-success">Available</span>
            </template>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-danger mt-3">
        Failed to load book details.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const book = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get(`/api/books/detail/${route.params.id}`)
    book.value = res.data.book
  } catch (err) {
    console.error('API error:', err)
  }
})

const onImageError = (e) => {
  e.target.src = '/placeholder.jpg'
}
</script>
