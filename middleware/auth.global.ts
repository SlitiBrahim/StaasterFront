import { useAuthStore } from "@/store/auth"

const publicRoutes = [
  'login',
  'signup',
  'password-reset',
]

// let i = 0

export default defineNuxtRouteMiddleware(async(to, from) => {
  console.log(to, from);
  
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    
    try {
      // last check before giving access to protected route:
      // check if user token is still up to date (not expired, user not deleted etc.)
      await authStore.authRefresh()
      console.log('refresh token ok');
    } catch(e) {
      console.log("error when refreshing token", e);
      return navigateTo('/login')
    }
  }

  // If the route is private and the user is not authenticated
  if (!publicRoutes.includes(to.name) && !authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  // If the route is public and the user is authenticated
  // example: trying to reach /login but already logged in
  if (publicRoutes.includes(to.name) && authStore.isAuthenticated) {
    return navigateTo('/dashboard');
  }

})
