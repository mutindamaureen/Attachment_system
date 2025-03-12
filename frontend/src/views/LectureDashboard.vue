<template>
  <div class="container mt-4"><br><br>
    <h2 class="text-center mb-4">Lecturer Dashboard</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
      <p>Loading students...</p>
    </div>

    <!-- Student List -->
    <div v-if="students.length" class="card shadow p-4">
      <h4 class="mb-3">Assigned Students</h4>
      <ul class="list-group">
        <li v-for="student in students" :key="student.id" 
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

      <div v-for="activity in studentActivities" :key="activity.id" class="mb-4 p-3 border rounded">
        <p><strong>Date:</strong> {{ formatDate(activity.date) }}</p>
        <p><strong>Activity:</strong> {{ activity.activity }}</p>
        <p><strong>Lesson Learned:</strong> {{ activity.lesson_learned }}</p>
        <p><strong>Supervisor's Comment:</strong> {{ activity.supervisor_comment || "No comment yet" }}</p>

        <!-- Lecturer's Comment -->
        <div v-if="activity.lecturer_comment" class="alert alert-info">
          <strong>Lecturer's Comment:</strong> {{ activity.lecturer_comment }}
        </div>
        
        <div v-else>
          <!-- Comment Input -->
          <textarea v-model="comments[activity.id]" class="form-control mb-2"
                    placeholder="Write a comment..." rows="2">
          </textarea>
          <button @click="submitComment(activity.id)" class="btn btn-sm btn-success">
            Submit Comment
          </button>
        </div>
      </div>

      <!-- Grading Section -->
      <div class="mt-4">
        <h5>Grade Student</h5>

        <!-- Show Grade if Already Graded -->
        <div v-if="selectedStudent.grade !== null" class="card text-white bg-success p-3">
          <h5>Final Grade: {{ selectedStudent.grade }}</h5>
        </div>

        <!-- Show Grading Form if Not Graded -->
        <div v-else class="d-flex">
          <input v-model="grade" type="number" class="form-control me-2" placeholder="Enter grade (0-100)">
          <button @click="submitGrade" class="btn btn-sm btn-primary">Submit Grade</button>
        </div>

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
      grade: "",
      loading: true
    };
  },
  async created() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await API.get("lecturer/students/");
        this.students = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching students:", error);
        this.loading = false;
      }
    },
    async selectStudent(student) {
      this.selectedStudent = { ...student };
      this.fetchStudentActivities(student.id);
    },
    async fetchStudentActivities(studentId) {
      try {
        const response = await API.get(`lecturer/students/${studentId}/activities/`);
        this.studentActivities = response.data;
        
        // Fetch the student's grade
        const gradeResponse = await API.get(`lecturer/students/${studentId}/grade/`);
        this.selectedStudent.grade = gradeResponse.data.grade; 
      } catch (error) {
        console.error("Error fetching student activities or grade:", error);
      }
    },
    async submitComment(activityId) {
      if (!this.comments[activityId]?.trim()) return;

      try {
        await API.patch(`lecturer/comment/${activityId}/`, {
          lecturer_comment: this.comments[activityId]
        });

        this.studentActivities = this.studentActivities.map(activity => 
          activity.id === activityId ? { ...activity, lecturer_comment: this.comments[activityId] } : activity
        );

        this.comments[activityId] = "";
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    },
    async submitGrade() {
      if (!this.grade || this.grade < 0 || this.grade > 100) return;

      try {
        await API.patch(`lecturer/grade/${this.selectedStudent.id}/`, {
          grade: this.grade
        });

        this.selectedStudent.grade = this.grade;
        this.grade = "";
      } catch (error) {
        console.error("Error submitting grade:", error);
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
