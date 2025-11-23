<template>
  <div class="container-fluid my-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/books" class="text-primary text-decoration-none me-2">Book</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Edit</li>
      </ol>
    </nav>

    <!-- Error messages -->
    <div v-if="errors.length" class="alert alert-danger">
      <ul class="mb-0">
        <li v-for="e in errors" :key="e">{{ e }}</li>
      </ul>
    </div>

    <!-- Edit form -->
    <form @submit.prevent="submitForm">
      <div class="row g-3 mb-3">
        <div class="col-md-8">
          <label for="title" class="form-label">Title</label>
          <input v-model="form.title" id="title" type="text" class="form-control" required />
        </div>
        <div class="col-md-4">
          <label for="location" class="form-label">Location</label>
          <select v-model="form.location" id="location" class="form-select">
            <option value="">Select location</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          v-model="form.description"
          id="description"
          class="form-control"
          rows="5"
        ></textarea>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label for="isbn" class="form-label">ISBN</label>
          <input v-model="form.isbn" id="isbn" type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="author" class="form-label">Author</label>
          <input v-model="form.author" id="author" type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="year" class="form-label">Year</label>
          <input
            v-model="form.year"
            id="year"
            type="number"
            min="1000"
            max="2100"
            step="1"
            class="form-control"
          />
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label for="coverimage" class="form-label">Cover Image URL</label>
          <input v-model="form.coverimage" id="coverimage" type="url" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="publisher" class="form-label">Publisher</label>
          <input v-model="form.publisher" id="publisher" type="text" class="form-control" />
        </div>
        <div class="col-md-4">
          <label for="category" class="form-label">Category</label>
          <select v-model="form.category" id="category" class="form-select">
            <option value="">Select category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <div class="form-check mb-4">
        <input
          v-model="form.isHighlighted"
          class="form-check-input"
          type="checkbox"
          id="isHighlighted"
        />
        <label class="form-check-label" for="isHighlighted">Highlight</label>
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <button type="submit" class="btn btn-primary">Save</button>
        <button @click.prevent="deleteBook" class="btn btn-danger">Delete</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id

const form = ref({
  title: '',
  description: '',
  isbn: '',
  author: '',
  year: '',
  coverimage: '',
  publisher: '',
  category: '',
  location: '',
  isHighlighted: false,
})

const errors = ref([])

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

// Fetch existing book data
onMounted(async () => {
  try {
    const res = await axios.get(`/api/books/${bookId}`)
    form.value = {
      ...form.value,
      ...res.data.book,
    }
  } catch {
    errors.value = ['Failed to load book data.']
  }
})

// Save changes
const submitForm = async () => {
  errors.value = []
  try {
    await axios.put(`/api/books/${bookId}`, form.value)
    router.push(`/book/detail/${bookId}`)
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      errors.value = ['Something went wrong.']
    }
  }
}

// Delete book
const deleteBook = async () => {
  if (!confirm('Are you sure you want to delete this book? This cannot be undone.')) return
  try {
    await axios.delete(`/api/books/${bookId}`)
    router.push('/books')
  } catch {
    errors.value = ['Failed to delete book.']
  }
}
</script>
