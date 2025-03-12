<template>
  <footer class="footer text-center py-3">
    <div class="container">
      <p class="mb-0">&copy; {{ new Date().getFullYear() }} Attachment Management. All rights reserved.</p>
      <ul class="footer-links">
        <li><router-link to="/" class="text-dark">Home</router-link></li>
        <li><router-link to="/about" class="text-dark">About</router-link></li>
        <li><router-link to="/contact" class="text-dark">Contact</router-link></li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.footer {
  background: white; /* White background */
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1); /* Shadow at the top */
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.footer-links li {
  display: inline;
}

.footer-links a {
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #0d6efd; 
}
</style>
