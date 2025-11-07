import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BooksView from '@/views/BooksView.vue'
import BookAddView from '@/views/BookAddView.vue'
import BookDetailView from '@/views/BookDetailView.vue'
import BookEditView from '@/views/BookEditView.vue'
import SearchView from '../views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/books',
      name: 'books',
      // lazy-loaded
      component: BooksView,
    },
    {
      path: '/book/add',
      name: 'book-add',
      // lazy-loaded
      component: BookAddView,
    },
    {
      path: '/book/detail/:id',
      name: 'book-detail',
      // lazy-loaded
      component: BookDetailView,
      props: true, // allows :id to be passed as a prop
    },
    {
      path: '/book/edit/:id',
      name: 'book-edit',
      // lazy-loaded
      component: BookEditView,
      props: true,
    },
    { path: '/search',
      name: 'search',
      component: SearchView },
  ],
})

export default router
