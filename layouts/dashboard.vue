<template>
  <v-app id="inspire">
    <v-app-bar
      elevation="0"
      color="primary"
    >
    </v-app-bar>

    <v-navigation-drawer
      elevation="0"
      >
        <v-list>
          <v-list-item
            :prepend-avatar="gravatarUrl"
            :title="fullname"
            :subtitle="email"
          >
            <v-list-item-content>
              <Avatar :username="email" :size="45"></Avatar>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item color="primary" prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
          <v-list-item color="primary" prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
          <v-list-item color="primary" prepend-icon="mdi-cog" title="Settings" value="settings" @click="naviguateToSettings"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-6">
            <v-btn block color="grey" @click="logout">
              Logout
            </v-btn>
          </div>
        </template>
    </v-navigation-drawer>

    <v-main id="main-content">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()
import md5 from 'md5'; 

const fullname = authStore.user.name
const email = authStore.user.email

const logout = async () => {
  await authStore.logout()
  await navigateTo('/login')
}

const naviguateToSettings = async () => {
  await navigateTo('/dashboard/settings')
}

const gravatarUrl = computed(() => {
  const emailHash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${emailHash}`;
});

</script>


<style lang="scss" scoped>

#main-content {
  margin: 25px;
}

</style>