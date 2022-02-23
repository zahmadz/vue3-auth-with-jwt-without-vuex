import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
// import { useCookies } from 'vue3-cookies';
// const { cookies } = useCookies();

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    fetch('http://localhost:3000/auth/verify', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 'ok') {
          return next();
        } else {
          alert(`You must be logged in to view this page.`);
          return next({ name: 'Home' });
        }
      })
      .catch((err) => {
        console.log('error when verifying auth', err);
        return next();
      });
  } else next();
});

export default router;
