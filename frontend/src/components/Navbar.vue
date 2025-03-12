<template>
  <nav class="navbar">
    <div class="container">
      <router-link class="navbar-brand" to="/">Industrial Attachment Management</router-link>
      <ul class="navbar-menu">
        <li><router-link to="/" active-class="active-link">Home</router-link></li>

        <!-- Role-Based Dashboards -->
        <li v-if="userRole === 'student'" class="nav-item">
          <router-link to="/student-dashboard" active-class="active-link" class="nav-link">Dashboard</router-link>
        </li>
        <li v-if="userRole === 'supervisor'" class="nav-item">
          <router-link to="/supervisor-dashboard" active-class="active-link" class="nav-link">Dashboard</router-link>
        </li>
        <li v-if="userRole === 'lecturer'" class="nav-item">
          <router-link to="/lecturer-dashboard" class="nav-link" active-class="active-link">Dashboard</router-link>
        </li>

        <template v-if="isAuthenticated">
          <li class="username"><router-link to="/profile" active-class="active-link">Welcome, {{ username }}</router-link></li>
          <li><button @click="logout" class="logout-btn">Logout</button></li>
        </template>

        <template v-else>
          <li><router-link to="/login" active-class="active-link">Login</router-link></li>
          <li><router-link to="/register" active-class="active-link">Register</router-link></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import API from "../api"; // Ensure you have an API service to fetch user data
import { eventBus } from "../eventBus"; // Import event bus


export default {
  name: "Navbar",
  data() {
    return {
      username: "",
      isAuthenticated: false,
      userRole: "",
    };
  },
  async created() {
    this.checkAuth();
  },
  mounted() {
    window.addEventListener("storage", this.checkAuth);
    eventBus.on("auth-changed", this.checkAuth);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.checkAuth);
    eventBus.off("auth-changed", this.checkAuth);
  },
  methods: {
    async checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get("profile/");
          this.username = response.data.username;
          this.userRole = response.data.role;
          this.isAuthenticated = true;
        } catch (error) {
          this.logout(); // Logout if token is invalid
        }
      } else {
        this.isAuthenticated = false;
        this.username = "";
        this.userRole = "";
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.isAuthenticated = false;
      this.username = "";
      this.userRole = "";
      this.$router.push("/login");
      eventBus.emit("auth-changed");
    },
  },
};
</script>

<style scoped>
.navbar {
  background: white;
  color: #333;
  padding: 15px 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}

.navbar-menu {
  list-style: none;
  display: flex;
  gap: 15px;
  align-items: center;
}

.navbar-menu li {
  display: inline;
}

.navbar-menu a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding-bottom: 5px;
  transition: color 0.3s ease, border-bottom 0.3s ease;
}

.navbar-menu a.active-link {
  border-bottom: 3px solid #007bff;
  color: #007bff;
}

.navbar-menu a:hover {
  color: #007bff;
}

.username {
  font-weight: bold;
  color: #007bff;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.logout-btn:hover {
  background: #c82333;
}
</style>
