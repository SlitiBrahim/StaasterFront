<template>
  <v-container fluid>
    <v-row>
      <div>
        <div class="text-h6">Settings</div>
      </div>
    </v-row>

    <v-row align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-text>
            <v-list dense>
              <v-list-item @click="navigateToPasswordChange">
                <v-list-item-icon>
                  <v-icon>mdi-lock</v-icon>
                </v-list-item-icon>
                <v-list-item-content> Change Password </v-list-item-content>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content> Logout </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()

definePageMeta({
  layout: "dashboard",
});

const navigateToPasswordChange = async () => {
    await navigateTo('/password-change')
}

const logout = async () => {
  await authStore.logout()
  await navigateTo('/login')
}

</script>

<style></style>
