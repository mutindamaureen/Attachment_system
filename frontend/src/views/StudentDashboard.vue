<template>
  <div class="container mt-4" v-cloak>
    <h2 class="text-center mb-4">Student Dashboard</h2>

    <!-- Display Date -->
    <div class="text-center mb-4">
      <h5 class="text-primary">{{ displayDate }}</h5>
    </div>

    <!-- Activity Submission Form (Only for Weekdays) -->
    <div v-if="isWeekday" class="card shadow p-4 mb-4">
      <h4 class="mb-3">Student Daily Activity</h4>

      <!-- Show Form if activity is not yet submitted -->
      <form v-if="!hasSubmittedToday" @submit.prevent="submitActivity">
        <div class="mb-3">
          <label class="form-label"><strong>Today's Activity</strong></label>
          <textarea
            v-model="activity"
            class="form-control"
            placeholder="Describe today's activity"
            rows="3"
            required
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label"><strong>Lesson Learned</strong></label>
          <textarea
            v-model="lessonLearned"
            class="form-control"
            placeholder="What did you learn today?"
            rows="2"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="loading || !activity.trim() || !lessonLearned.trim()"
        >
          {{ loading ? "Submitting..." : "Submit" }}
        </button>
      </form>

      <!-- Success Message -->
      <div v-if="successMessage" class="alert alert-success text-center mt-3">
        {{ successMessage }}
      </div>

      <!-- Show Message if activity is submitted -->
      <div v-else-if="hasSubmittedToday" class="alert alert-success text-center">
        <strong>Today's activity has already been submitted.</strong>
      </div>

      <!-- Show API Error -->
      <div v-if="errorMessage" class="alert alert-danger text-center mt-3">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Weekend Message -->
    <div v-else class="alert alert-info text-center">
      <strong>It's the weekend!</strong> You can review your past activities.
    </div>

    <!-- Activities List -->
    <div v-if="activities.length" class="card shadow p-4">
      <h4 class="mb-3">Submitted Activities</h4>

      <div v-if="loading" class="text-center my-3">
        <span class="spinner-border text-primary"></span>
      </div>

      <div v-else>
        <div v-for="act in activities" :key="act.id" class="mb-3 p-3 border rounded">
          <p><strong>Date:</strong> {{ formatDate(act.date) }}</p>
          <p><strong>Activity:</strong> {{ act.activity }}</p>
          <p><strong>Lesson Learned:</strong> {{ act.lesson_learned }}</p>
          <p><strong>Supervisor's Comment:</strong> {{ act.supervisor_comment || "No comment yet" }}</p>
          <p><strong>Lecturer's Comment:</strong> {{ act.lecturer_comment || "No comment yet" }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted mt-3">No activities submitted yet.</div>
  </div>
</template>

<script>
import API from "../api";

export default {
  data() {
    return {
      activity: "",
      lessonLearned: "",
      activities: [],
      loading: false,
      errorMessage: "",
      successMessage: "",
      currentDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    };
  },
  computed: {
    isWeekday() {
      const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
      return today >= 1 && today <= 5;
    },
    displayDate() {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      return new Date().toLocaleDateString(undefined, options);
    },
    hasSubmittedToday() {
      return this.activities.some((act) => act.date === this.currentDate);
    }
  },
  async created() {
    await this.fetchActivities();
  },
  methods: {
    formatDate(date) {
      if (!date) return "Invalid Date"; // Handle missing or null date

      let parsedDate = new Date(date);

      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        // Try parsing again by manually converting to YYYY-MM-DD format
        const parts = date.split("T")[0]; // Extract YYYY-MM-DD
        parsedDate = new Date(parts);
      }

      if (isNaN(parsedDate.getTime())) return "Invalid Date"; // Final check

      const options = { year: "numeric", month: "long", day: "numeric" };
      return parsedDate.toLocaleDateString(undefined, options);
    },

    async fetchActivities() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const response = await API.get("activities/");
        this.activities = response.data;
      } catch (error) {
        console.error("Error fetching activities:", error.response?.data || error);
        this.errorMessage = "Failed to fetch activities. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    async submitActivity() {
      if (!this.activity.trim() || !this.lessonLearned.trim()) return;

      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const response = await API.post("activities/", {
          activity: this.activity,
          lesson_learned: this.lessonLearned,
        });

        this.activities.push(response.data);
        this.activities = [...this.activities];
        this.activity = "";
        this.lessonLearned = "";
        this.successMessage = "Activity submitted successfully!";
      } catch (error) {
        console.error("Error submitting activity:", error.response?.data || error);
        this.errorMessage = error.response?.data?.error || "Failed to submit activity";
      } finally {
        this.loading = false;
        setTimeout(() => (this.successMessage = ""), 3000); // Auto-hide success message after 3 seconds
      }
    },
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
.card {
  background: #fff;
  border-radius: 10px;
  border: none;
}
</style>
