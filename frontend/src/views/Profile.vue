<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      <p>{{ error }}</p>
    </div>

    <div v-else class="card shadow p-4">
      <h2 class="text-center">User Profile</h2>
      <div class="d-flex justify-content-center">
        <img :src="user.avatar || defaultAvatar" alt="Profile Picture" class="profile-img">
      </div>
      <div class="mt-3">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Full Name:</strong> {{ user.full_name }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
      </div>
      <button class="btn btn-primary w-100" @click="editProfile">Edit Profile</button>
    </div>
  </div>
</template>

<script>
import API from "../api"; // Make sure this points to your API service

export default {
  data() {
    return {
      user: {},
      loading: true,
      error: "",
      defaultAvatar: "https://via.placeholder.com/150", // Placeholder avatar
    };
  },
  async created() {
    try {
      const response = await API.get("profile/");
      this.user = response.data;
    } catch (err) {
      this.error = "Failed to load profile data.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    editProfile() {
      this.$router.push("/edit-profile"); // Redirect to edit profile page
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: auto;
  background: #fff;
  border-radius: 10px;
  border: none;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
}
</style>
