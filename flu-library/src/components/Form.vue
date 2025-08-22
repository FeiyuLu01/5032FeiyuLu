<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">User Information Form</h1>
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-md-6 col-sm-6">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username"
                  @blur="validateName(true)"
                  @input="validateName(false)"
                  v-model="formData.username" />
                <div v-if="errors.username" class="text-danger">
                  {{ errors.username }}
                </div>
              </div>
              <div class="col-md-6 col-sm-6">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password"
                  @blur="validatePassword(true)"
                  @input="validatePassword(false)"
                  v-model="formData.password" />
                <div v-if="errors.password" class="text-danger">
                  {{ errors.password }}
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="isAustralian" 
                    @change="validateAustralianResident(true)"
                    v-model="formData.isAustralian">
                  <label class="form-check-label" for="isAustralian">Australian Resident?</label>
                </div>
                <div v-if="errors.isAustralian" class="text-danger">
                  {{ errors.isAustralian }}
                </div>
              </div>
              <div class="col-md-6">
                <label for="gender" class="form-label">Gender</label>
                <select class="form-select" id="gender" 
                  @blur="validateGender(true)"
                  @change="validateGender(true)"
                  v-model="formData.gender">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div v-if="errors.gender" class="text-danger">
                  {{ errors.gender }}
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="reason" class="form-label">Reason for joining</label>
              <textarea class="form-control" id="reason" rows="3" 
                @blur="validateReason(true)"
                @input="validateReason(false)"
                v-model="formData.reason"></textarea>
              <div v-if="errors.reason" class="text-danger">
                {{ errors.reason }}
              </div>
            </div>
  
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
            </div>
          </form>
  
          <!-- Simple PrimeVue DataTable -->
          <div class="row mt-5" v-if="submittedCards.length">
            <div class="col-12">
              <h3 class="text-center mb-4">Submitted Data</h3>
              <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
                <Column field="username" header="Username"></Column>
                <Column field="password" header="Password">
                  <template #body="slotProps">
                    {{ '•'.repeat(slotProps.data.password.length) }}
                  </template>
                </Column>
                <Column field="isAustralian" header="Australian Resident">
                  <template #body="slotProps">
                    {{ slotProps.data.isAustralian ? 'Yes' : 'No' }}
                  </template>
                </Column>
                <Column field="gender" header="Gender"></Column>
                <Column field="reason" header="Reason"></Column>
                <Column header="Actions">
                  <template #body="slotProps">
                    <button 
                      class="btn btn-sm btn-danger"
                      @click="removeCard(slotProps.index)">
                      Remove
                    </button>
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  const formData = ref({
      username: '',
      password: '',
      isAustralian: false,
      reason: '',
      gender: ''
  });
  
  const submittedCards = ref([]);
  
  const errors = ref({
      username: null,
      password: null,
      isAustralian: null,
      gender: null,
      reason: null
  });
  
  // Add a counter for unique IDs
  let nextId = 1;
  const submitForm = () => {
      // Validate all fields before submission
      validateName(true);
      validatePassword(true);
      validateAustralianResident(true);
      validateGender(true);
      validateReason(true);
      
      // Check if there are any errors
      const hasErrors = Object.values(errors.value).some(error => error !== null);
      
      if (!hasErrors) {
          // Add unique ID to each submission
          submittedCards.value.push({
              id: nextId++,
              ...formData.value
          });
          clearForm();
      } else {
          alert('Please fix all validation errors before submitting.');
      }
  };
  
  const clearForm = () => {
      formData.value = {
          username: '',
          password: '',
          isAustralian: false,
          reason: '',
          gender: ''
      };
      // Clear all errors
      errors.value = {
          username: null,
          password: null,
          isAustralian: null,
          gender: null,
          reason: null
      };
  };
  
  const removeCard = (index) => {
      submittedCards.value.splice(index, 1);
  };
  
  const validateName = (blur) => {
      if (formData.value.username.length < 3) {
          if (blur) errors.value.username = "Username must be at least 3 characters";
      } else {
          errors.value.username = null;
      }
  };
  
  const validatePassword = (blur) => {
      const password = formData.value.password;
      const minLength = 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
      if (password.length < minLength) {
          if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
      } else if (!hasUppercase) {
          if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
      } else if (!hasLowercase) {
          if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
      } else if (!hasNumber) {
          if (blur) errors.value.password = "Password must contain at least one number.";
      } else if (!hasSpecialChar) {
          if (blur) errors.value.password = "Password must contain at least one special character.";
      } else {
          errors.value.password = null;
      }
  };
  
  const validateAustralianResident = (blur) => {
      // Remove the restrictive validation - allow both checked and unchecked
      errors.value.isAustralian = null;
  };
  
  const validateGender = (blur) => {
      if (!formData.value.gender || formData.value.gender === '') {
          if (blur) errors.value.gender = "Please select a gender.";
      } else {
          errors.value.gender = null;
      }
  };
  
  const validateReason = (blur) => {
      const reason = formData.value.reason.trim();
      
      if (reason.length < 10) {
          if (blur) errors.value.reason = "Reason must be at least 10 characters long.";
      } else if (reason.length > 500) {
          if (blur) errors.value.reason = "Reason must not exceed 500 characters.";
      } else {
          errors.value.reason = null;
      }
  };
  </script>
  
  <style scoped>
  /* Responsive Design for Different Devices */
  @media (max-width: 576px) {
      .container {
          padding: 0 15px;
      }
      
      .col-md-6 {
          margin-bottom: 1rem;
      }
      
      .btn {
          width: 100%;
          margin-bottom: 0.5rem;
      }
      
      .btn:last-child {
          margin-bottom: 0;
      }
  }
  
  @media (min-width: 577px) and (max-width: 768px) {
      .table-responsive {
          font-size: 0.9rem;
      }
  }
  
  /* Touch-friendly design for mobile devices */
  @media (hover: none) and (pointer: coarse) {
      .btn {
          padding: 12px 20px;
          font-size: 16px;
      }
      
      .form-control, .form-select {
          padding: 12px;
          font-size: 16px;
      }
  }
  
  /* Table styling */
  .table th[style*="cursor: pointer"]:hover {
      background-color: rgba(255, 255, 255, 0.1);
  }
  
  .pagination .page-link {
      color: #0d6efd;
  }
  
  .pagination .page-item.active .page-link {
      background-color: #0d6efd;
      border-color: #0d6efd;
  }
  </style>