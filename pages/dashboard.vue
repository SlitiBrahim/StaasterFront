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
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
            title="Brahim Sliti"
            subtitle="brahim.sliti@gmail.com"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item color="primary" prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
          <v-list-item color="primary" prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
          <v-list-item color="primary" prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-6">
            <v-btn block color="grey">
              Logout
            </v-btn>
          </div>
        </template>
    </v-navigation-drawer>

    <v-main>
      <!--  -->
    </v-main>
  </v-app>
</template>

<script setup>
</script>
