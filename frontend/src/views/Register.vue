<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow-lg" style="width: 400px;">
      <h2 class="text-center mb-4">Register</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input 
            type="text" 
            id="username" 
            class="form-control" 
            v-model="username" 
            placeholder="Enter your username" 
            required 
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            class="form-control" 
            v-model="email" 
            placeholder="Enter your email" 
            required 
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input 
            type="password" 
            id="password" 
            class="form-control" 
            v-model="password" 
            placeholder="Enter your password" 
            required 
          />
        </div>

        <div class="mb-3">
          <label for="role" class="form-label">Select Role</label>
          <select id="role" class="form-select" v-model="role">
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          {{ loading ? "Registering..." : "Register" }}
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
      username: "", 
      email: "", 
      password: "", 
      role: "student", 
      message: "", 
      success: false,
      loading: false
    };
  },
  methods: {
    async register() {
      this.loading = true;
      this.message = "";
      try {
        await API.post("register/", {
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role
        });
        this.success = true;
        this.message = "Registration successful! Redirecting to login...";
        
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        this.success = false;
        this.message = error.response?.data?.error || "Error registering user.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
