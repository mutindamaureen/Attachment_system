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
      <h2 class="text-center">Edit Profile</h2>

      <div class="d-flex justify-content-center">
        <img :src="profile.avatar || defaultAvatar" alt="Profile Picture" class="profile-img">
      </div>

      <form @submit.prevent="updateProfile" class="mt-3">
        <div class="mb-3">
          <label for="avatar" class="form-label">Profile Picture</label>
          <input type="file" class="form-control" @change="handleFileUpload">
        </div>

        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" id="username" class="form-control" v-model="profile.username" required>
        </div>

        <div class="mb-3">
          <label for="full_name" class="form-label">Full Name</label>
          <input type="text" id="full_name" class="form-control" v-model="profile.full_name" required>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" class="form-control" v-model="profile.email" required>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">New Password (optional)</label>
          <input type="password" id="password" class="form-control" v-model="profile.password">
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          {{ loading ? "Updating..." : "Update Profile" }}
        </button>
      </form>

      <p v-if="message" :class="`text-center mt-3 ${success ? 'text-success' : 'text-danger'}`">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import API from "../api";

export default {
  data() {
    return {
      profile: { username: "", full_name: "", email: "", avatar: "", password: "" },
      loading: true,
      error: "",
      message: "",
      success: false,
      defaultAvatar: "https://via.placeholder.com/150",
      selectedFile: null,
    };
  },
  async created() {
    try {
      const response = await API.get("profile/");
      this.profile = response.data;
    } catch (err) {
      this.error = "Failed to load profile data.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async updateProfile() {
      this.loading = true;
      this.message = "";

      try {
        const formData = new FormData();
        formData.append("username", this.profile.username);
        formData.append("full_name", this.profile.full_name);
        formData.append("email", this.profile.email);

        if (this.profile.password) {
          formData.append("password", this.profile.password);
        }
        if (this.selectedFile) {
          formData.append("avatar", this.selectedFile);
        }

        await API.put("profile/edit/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.success = true;
        this.message = "Profile updated successfully!";
      } catch (error) {
        this.success = false;
        this.message = error.response?.data?.detail || "Failed to update profile.";
      } finally {
        this.loading = false;
      }
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
