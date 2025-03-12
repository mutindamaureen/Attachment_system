import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue'
import Dashboard from '../views/StudentDashboard.vue';
import API from '../api';
import Profile from '../views/Profile.vue';
import SupervisorDashboard from '../views/SupervisorDashboard.vue';
import LectureDashboard from '../views/LectureDashboard.vue';
import EditProfile from '../views/EditProfile.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/', component: Home },
  { path: '/profile', component: Profile },
  { path: '/student-dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/lecturer-dashboard', component: LectureDashboard, meta: { requiresAuth: true } },
  { path: '/supervisor-dashboard', component: SupervisorDashboard, meta: { requiresAuth: true } },
  { path: '/edit-Profile', component: EditProfile },



];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) return next('/login');
    try {
      const response = await API.get('profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      next();
    } catch {
      localStorage.removeItem('token');
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
