<template>
  <div class="container mt-4"><br><br>
    <h2 class="text-center mb-4">Supervisor Dashboard</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
      <p>Loading students...</p>
    </div>

    <!-- Student List -->
    <div v-if="students.length" class="card shadow p-4">
      <h4 class="mb-3">Assigned Students</h4>
      <ul class="list-group">
        <li 
          v-for="student in students" 
          :key="student.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          @click="selectStudent(student)">
          {{ student.name }}
          <span class="badge bg-primary">View Activities</span>
        </li>
      </ul>
    </div>

    <div v-else class="text-center text-muted mt-3">No students assigned.</div>

    <!-- Student Activity Details -->
    <div v-if="selectedStudent" class="card shadow p-4 mt-4">
      <h4 class="mb-3">{{ selectedStudent.name }}'s Activities</h4>

      <div 
        v-for="activity in studentActivities" 
        :key="activity.id" 
        class="mb-4 p-3 border rounded">
        
        <p><strong>Date:</strong> {{ formatDate(activity.date) }}</p>
        <p><strong>Activity:</strong> {{ activity.activity }}</p>
        <p><strong>Lesson Learned:</strong> {{ activity.lesson_learned }}</p>

        <p><strong>Supervisor's Comment:</strong> 
          <span v-if="activity.supervisor_comment">
            {{ activity.supervisor_comment }}
          </span>
          <span v-else>No comment yet</span>
        </p>

        <!-- Comment Input -->
        <div v-if="!activity.supervisor_comment" class="mb-2">
          <textarea 
            v-model="comments[activity.id]" 
            class="form-control"
            placeholder="Write a comment..." 
            rows="2">
          </textarea>
        </div>
        
        <button 
          v-if="!activity.supervisor_comment" 
          @click="submitComment(activity.id)" 
          class="btn btn-sm btn-success">
          Submit Comment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import API from "../api";

export default {
  data() {
    return {
      students: [],
      selectedStudent: null,
      studentActivities: [],
      comments: {},
      loading: true
    };
  },
  async created() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await API.get("supervisor/students/");
        this.students = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching students:", error);
        this.loading = false;
      }
    },
    async selectStudent(student) {
      this.selectedStudent = student;
      this.fetchStudentActivities(student.id);
    },
    async fetchStudentActivities(studentId) {
      try {
        const response = await API.get(`supervisor/students/${studentId}/activities/`);
        this.studentActivities = response.data;
      } catch (error) {
        console.error("Error fetching student activities:", error);
      }
    },
    async submitComment(activityId) {
      if (!this.comments[activityId]?.trim()) return;

      try {
        await API.patch(`supervisor/comment/${activityId}/`, {
          supervisor_comment: this.comments[activityId]
        });

        // Update the UI: Replace input with saved comment
        this.studentActivities = this.studentActivities.map(activity => 
          activity.id === activityId ? { ...activity, supervisor_comment: this.comments[activityId] } : activity
        );

        this.comments[activityId] = ""; // Clear input field
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 10px;
  border: none;
}
.list-group-item {
  cursor: pointer;
}
</style>
