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
              <router-link class="nav-link active" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/books">Books</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search">Search</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Carousel -->
    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div
          v-for="(src, idx) in carouselImages.length ? carouselImages : ['/placeholder.jpg']"
          :key="idx"
          class="carousel-item"
          :class="{ active: idx === 0 }"
        >
          <img :src="src" class="d-block w-100" alt="Book image" />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Tabs -->
    <section class="my-5">
      <div class="container">
        <ul class="nav nav-tabs" id="booksTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="new-tab"
              data-bs-toggle="tab"
              data-bs-target="#new"
              type="button"
              role="tab"
            >
              New
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="trending-tab"
              data-bs-toggle="tab"
              data-bs-target="#trending"
              type="button"
              role="tab"
            >
              Trending
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="hot-tab"
              data-bs-toggle="tab"
              data-bs-target="#hot"
              type="button"
              role="tab"
            >
              Hot
            </button>
          </li>
        </ul>

        <div class="tab-content pt-4" id="booksTabsContent">
          <!-- New Books -->
          <div class="tab-pane fade show active" id="new" role="tabpanel" aria-labelledby="new-tab">
            <div class="row g-4">
              <div v-for="book in newBooks" :key="book._id" class="col-12">
                <div class="d-flex">
                  <img
                    :src="book.coverimage"
                    alt="cover"
                    class="me-3"
                    style="width: 64px; height: 64px; object-fit: cover"
                  />
                  <div>
                    <h4 class="mb-1">{{ book.title }}</h4>
                    <p class="mb-0 text-muted">{{ book.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Trending Books -->
          <div class="tab-pane fade" id="trending" role="tabpanel" aria-labelledby="trending-tab">
            <div class="row g-4">
              <div v-for="book in trendingBooks" :key="book._id" class="col-12">
                <div class="d-flex">
                  <img
                    :src="book.coverimage"
                    alt="cover"
                    class="me-3"
                    style="width: 64px; height: 64px; object-fit: cover"
                  />
                  <div>
                    <h4 class="mb-1">{{ book.title }}</h4>
                    <p class="mb-0 text-muted">{{ book.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hot Books -->
          <div class="tab-pane fade" id="hot" role="tabpanel" aria-labelledby="hot-tab">
            <div class="row g-4">
              <div v-for="book in hotBooks" :key="book._id" class="col-12">
                <div class="d-flex">
                  <img
                    :src="book.coverimage"
                    alt="cover"
                    class="me-3"
                    style="width: 64px; height: 64px; object-fit: cover"
                  />
                  <div>
                    <h4 class="mb-1">{{ book.title }}</h4>
                    <p class="mb-0 text-muted">{{ book.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const carouselImages = ref([])
const newBooks = ref([])
const trendingBooks = ref([])
const hotBooks = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/books/home')
    carouselImages.value = res.data.carouselImages
    newBooks.value = res.data.newBooks
    trendingBooks.value = res.data.trendingBooks
    hotBooks.value = res.data.hotBooks
  } catch (err) {
    console.error('API error:', err)
  }
})
</script>

<style>
.carousel {
  height: 400px;
}
.carousel-inner {
  height: 100%;
}
.carousel-item {
  height: 100%;
}
.carousel-item img {
  height: 100%;
  object-fit: cover;
}
</style>
