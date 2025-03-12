<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow-lg" style="width: 400px;">
      <h2 class="text-center mb-4">Login</h2>
      <form @submit.prevent="login">
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

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          {{ loading ? "Logging in..." : "Login" }}
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
import { eventBus } from "../eventBus";

export default {
  data() {
    return { 
      username: "", 
      password: "", 
      message: "", 
      success: false, 
      loading: false 
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.message = "";
    
      try {
        const response = await API.post("login/", {
          username: this.username,
          password: this.password,
        });
    
        // Store token
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("username", this.username);
    
        // Fetch user profile to determine role
        const profileResponse = await API.get("profile/");
        console.log("Profile Data:", profileResponse.data); // Debugging
    
        const userRole = profileResponse.data.role || ""; // Ensure role exists
    
        this.success = true;
        this.message = "Login successful! Redirecting...";
    
        // Redirect based on role
        if (userRole === "lecturer") {
          this.$router.push("/lecturer-dashboard");
        } else if (userRole === "supervisor") {
          this.$router.push("/supervisor-dashboard");
        } else {
          this.$router.push("/student-dashboard"); // Default fallback
        }
        eventBus.emit("auth-changed"); 
      } catch (error) {
        this.success = false;
        this.message = error.response?.data?.detail || "Invalid credentials!";
      } finally {
        this.loading = false;
      }
    }

  }
};
</script>
