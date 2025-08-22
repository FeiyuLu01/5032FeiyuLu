<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">User Information Form</h1>
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" v-model="formData.username">
              </div>
              <div class="col-md-6">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="formData.password">
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="isAustralian" v-model="formData.isAustralian">
                  <label class="form-check-label" for="isAustralian">Australian Resident?</label>
                </div>
              </div>
              <div class="col-md-6">
                <label for="gender" class="form-label">Gender</label>
                <select class="form-select" id="gender" v-model="formData.gender">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div class="row mt-5" v-if="submittedCards.length">
              <div class="d-flex flex-wrap justify-content-start">
                  <div v-for="(card, index) in submittedCards" :key="index" class="card m-2" style="width: 18rem;">
                      <div class="card-header">
                          User Information
                      </div>
                      <ul class="list-group list-group-flush">
                          <li class="list-group-item">Username: {{ card.username }}</li>
                          <li class="list-group-item">Password: {{ card.password }}</li>
                          <li class="list-group-item">Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}</li>
                          <li class="list-group-item">Gender: {{ card.gender }}</li>
                          <li class="list-group-item">Reason: {{ card.reason }}</li>
                      </ul>
                  </div>
              </div>
              </div>
  
            <div class="mb-3">
              <label for="reason" class="form-label">Reason for joining</label>
              <textarea class="form-control" id="reason" rows="3" v-model="formData.reason"></textarea>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
    
  const formData = ref({
      username: '',
      password: '',
      isAustralian: false,
      reason: '',
      gender: ''
  });
  
  const submittedCards = ref([]);
  
  const submitForm = () => {
      submittedCards.value.push({
          ...formData.value
      });
  };</script>
  
  <style scoped>
  /*  Design for Different Devices */
  @media (max-width: 576px) {
      .container {
          padding: 0 15px;
      }
      .card {
          width: 100% !important;
          margin: 0.5rem 0 !important;
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
      .d-flex.flex-wrap {
          flex-direction: column;
      }
  }
  
  @media (min-width: 577px) and (max-width: 768px) {
      .card {
          width: calc(50% - 1rem) !important;
      }
  }
  
  @media (min-width: 769px) and (max-width: 992px) {
      .card {
          width: calc(33.333% - 1rem) !important;
      }
  }
  
  @media (min-width: 993px) {
      .card {
          width: 18rem !important;
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
      
      .card:hover {
          transform: none;
          box-shadow: none;
      }
  }</style>