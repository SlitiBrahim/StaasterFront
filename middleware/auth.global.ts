import { useAuthStore } from "@/store/auth"

const publicRoutes = [
  'login',
  'signup',
  'password-reset'
]

export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to, from);

  const authStore = useAuthStore()

  // redirect home to dashboars (which will redirect to /login if not authenticated)
  if (to.name === 'index') {
    return navigateTo('/dashboard');
  }

  // If the route is not in the public routes list and the user is not authenticated
  if (!publicRoutes.includes(to.name) && !authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  // If the route is in the public routes list and the user is authenticated
  if (publicRoutes.includes(to.name) && authStore.isAuthenticated) {
    return navigateTo('/dashboard');
  }
})
