import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  // later you’ll add BooksListView, BookDetailView, etc.
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
