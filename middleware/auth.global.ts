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

  // redirect home to dashboard (which will redirect to /login if not authenticated)
  if (to.name === 'index') {
    return navigateTo('/dashboard');
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

  // TODO: find a way to logout user if his token expired
  // it seems the solution is to call pb.collection('users').authRefresh() on each page transition
  // there are few issues:
  //    - since we are using pinia-plugin-persistedstate to restore the state after page reload
  //      it happens that when we display a page it goes through the middleware and the pb.collection('users').authRefresh()
  //      function but at that time the local store does not have the values of the persistant store yey
  //      resulting in having null values. we need to have the token value in order to do pb.authStore.save(token, { verified: false });
  //      so the pb.collection('users').authRefresh() call executes it with the token
  //    - I don't know why but with the code below, I often got TOO MANY REQUESTS errors
  //    - the requests to the api like to get 'posts' for example or whatever list
  //      always return 200 so if the user token expired (or an admin removed the user)
  //      we are not able to logout the user, since it will assume user is logged in because it has
  //      authStore.token but with this token the user will get 200 reponses with empty lists

  // choose one of the 2 try/catch bellow not both 
  // try {
  //   await authStore.authRefresh()
  //   console.log('refresh ok');
  // } catch {
  //   console.log("III", ++i);
  // }

  // // private route
  // if (!publicRoutes.includes(to.name)) {
  //   // last check before giving access to protected route:
  //   // check if user token is still up to date (not expired, user not deleted etc.)
  //   try {
  //     await authStore.authRefresh()
  //     console.log('refresh ok');
  //   } catch(e) {
  //     console.log('Could not refresh user token + record', e);
  //     return navigateTo('/login');
  //   }
  // }
})
