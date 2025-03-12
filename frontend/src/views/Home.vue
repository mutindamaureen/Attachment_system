<template>
  <section>
    <br /><br />
    <section class="banner">
      <div class="container text-center">
        <h1 class="mb-3">Welcome to Our Industrial Attachment System</h1>
        <p class="lead">
          Streamline student attachment management with our easy-to-use
          platform.
        </p>
      </div>
    </section>
    <!-- Our Services Section -->
    <section class="services">
      <div class="container text-center">
        <h2 class="mb-4">Our Services</h2>
        <div class="row">
          <div class="col-md-4">
            <div class="card service-card">
              <div class="card-body">
                <h5 class="card-title">Student Activity Logging</h5>
                <p class="card-text">
                  Students can log daily activities and track their progress
                  efficiently.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card service-card">
              <div class="card-body">
                <h5 class="card-title">Supervisor Reviews</h5>
                <p class="card-text">
                  Company supervisors can review and comment on student
                  activities.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card service-card">
              <div class="card-body">
                <h5 class="card-title">Lecturer Grading</h5>
                <p class="card-text">
                  Lecturers can evaluate student logs and assign grades
                  accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.banner {
  background-color: hsl(0, 13%, 92%); /* Light gray */
  padding: 40px 0;
  border-radius: 8px;
}

/* Services Section */
.services {
  padding: 50px 0;
}

.service-card {
  border: none;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  transition: transform 0.3s ease-in-out;
}

.service-card:hover {
  transform: translateY(-5px);
}
</style>

