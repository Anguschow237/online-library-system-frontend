import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BooksView from '@/views/BooksView.vue'
import BookAddView from '@/views/BookAddView.vue'
import BookDetailView from '@/views/BookDetailView.vue'
import BookEditView from '@/views/BookEditView.vue'
import SearchView from '../views/SearchView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminUsers from '@/views/AdminUsers.vue'
import AdminUserCreate from '@/views/AdminUserCreate.vue'
import AdminUserEdit from '@/views/AdminUserEdit.vue'
import { jwtDecode } from 'jwt-decode'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/books', name: 'books', component: BooksView },
    {
      path: '/book/add',
      name: 'book-add',
      component: BookAddView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/book/detail/:id',
      name: 'book-detail',
      component: BookDetailView,
      props: true
    },
    {
      path: '/book/edit/:id',
      name: 'book-edit',
      component: BookEditView,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/login', name: 'login', component: LoginView },

    // 🔑 Admin user management routes
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsers,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users/create',
      name: 'admin-user-create',
      component: AdminUserCreate,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users/edit/:id',
      name: 'admin-user-edit',
      component: AdminUserEdit,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ],
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return next('/login')
    }

    try {
      const decoded = jwtDecode(token)
      if (to.meta.requiresAdmin && decoded.role !== 'admin') {
        return next('/') // block normal users
      }
    } catch (err) {
      console.error('Invalid token', err)
      return next('/login')
    }
  }
  next()
})

export default router
