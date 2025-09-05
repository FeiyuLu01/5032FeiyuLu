<template>
  <div class="container my-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <header class="text-center mb-3">
          <h1 class="display-6">🗄️ W5. Library Registration Form</h1>
          <p class="text-muted mb-0">Let's build some more advanced features into our form.</p>
        </header>

        <form @submit.prevent="handleSubmit" novalidate>
          <!-- Username / Gender -->
          <div class="row g-3 mb-1">
            <div class="col-md-6">
              <label for="username" class="form-label">Username</label>
              <input
                id="username"
                type="text"
                class="form-control"
                v-model.trim="formData.username"
                @blur="validateName(true)"
                @input="validateName(false)"
              />
              <div v-if="errors.username" class="text-danger small mt-1">{{ errors.username }}</div>
            </div>
            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select
                id="gender"
                class="form-select"
                v-model="formData.gender"
                @blur="validateGender(true)"
                @change="validateGender(true)"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger small mt-1">{{ errors.gender }}</div>
            </div>
          </div>

          <!--  Password / Confirm Password -->
          <div class="row g-3 mb-1">
            <div class="col-md-6">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                type="password"
                class="form-control"
                v-model="formData.password"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
              />
              <div v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</div>
            </div>
            <div class="col-md-6">
              <label for="confirmPassword" class="form-label">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                class="form-control"
                v-model="formData.confirmPassword"
                @blur="validateConfirmPassword"
              />
              <div v-if="errors.confirmPassword" class="text-danger small mt-1">{{ errors.confirmPassword }}</div>
            </div>
          </div>

          <!-- Australian Resident -->
          <div class="mb-3">
            <div class="form-check">
              <input id="isAustralian" type="checkbox" class="form-check-input" v-model="formData.isAustralian">
              <label for="isAustralian" class="form-check-label">Australian Resident?</label>
            </div>
          </div>

          <!-- Reason for joining -->
          <div class="mb-1">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              id="reason"
              class="form-control"
              rows="3"
              v-model="formData.reason"
              @blur="validateReason(true)"
              @input="validateReason(false)"
            />
            <div v-if="errors.reason" class="text-danger small mt-1">{{ errors.reason }}</div>
            <div v-else-if="reasonSuccess" class="text-success small mt-1">{{ reasonSuccess }}</div>
          </div>

          <!-- Suburb -->
          <div class="mb-4">
            <label for="suburb" class="form-label">Suburb</label>
            <input id="suburb" type="text" class="form-control" v-model="formData.suburb" />
          </div>

          <!-- Buttons -->
          <div class="text-center mb-3">
            <button type="submit" class="btn btn-primary me-2" :disabled="isSubmitDisabled">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
            <button type="button" class="btn btn-outline-danger ms-2" @click="clearSaved">Clear Saved</button>
          </div>
        </form>

        <!-- PrimeVue DataTable -->
        <div class="d-flex justify-content-between align-items-center mt-4">
          <h6 class="fw-semibold mb-0">This is a Primevue Datatable.</h6>
          <small class="text-muted">Saved: {{ submittedCards.length }} entr{{ submittedCards.length === 1 ? 'y' : 'ies' }}</small>
        </div>
        <div v-if="submittedCards.length" class="mt-2">
          <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
            <Column field="username" header="Username" />
            <Column field="password" header="Password">
              <template #body="slotProps">{{ '•'.repeat(slotProps.data.password.length) }}</template>
            </Column>
            <Column field="isAustralian" header="Australian Resident">
              <template #body="slotProps">{{ slotProps.data.isAustralian ? 'Yes' : 'No' }}</template>
            </Column>
            <Column field="gender" header="Gender" />
            <Column field="reason" header="Reason" />
            <Column field="suburb" header="Suburb" />
            <Column header="Actions">
              <template #body="slotProps">
                <button class="btn btn-sm btn-danger" @click="removeCard(slotProps.index)">Remove</button>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const formData = ref({
  username: '',
  gender: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  suburb: 'Clayton'
});

const errors = ref({
  username: null,
  gender: null,
  password: null,
  confirmPassword: null,
  reason: null
});

const submittedCards = ref([]);
let nextId = 1;

// LocalStorage keys
const SUBMISSIONS_KEY = 'fit5032:w5:submissions';
const FORM_DRAFT_KEY = 'fit5032:w5:formDraft';

const validateName = (blur) => {
  if (formData.value.username.trim().length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters';
  } else {
    errors.value.username = null;
  }
};

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select a gender.';
  } else {
    errors.value.gender = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password || '';
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.';
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.';
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.';
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.';
  } else {
    errors.value.password = null;
  }
};

const validateConfirmPassword = () => {
  if (!formData.value.confirmPassword && !formData.value.password) {
    errors.value.confirmPassword = null;
    return;
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.';
  } else {
    errors.value.confirmPassword = null;
  }
};

const validateReason = (blur) => {
  const text = (formData.value.reason || '').trim();
  if (text.length < 10) {
    if (blur) errors.value.reason = 'Reason must be at least 10 characters';
  } else {
    errors.value.reason = null;
  }
};

const reasonSuccess = computed(() => {
  const text = (formData.value.reason || '').toLowerCase();
  if (!errors.value.reason && text.includes('friend')) {
    return 'Great to have a friend';
  }
  return '';
});

const isSubmitDisabled = computed(() => {
  // required fields validation
  const requiredOk =
    formData.value.username.trim().length >= 3 &&
    !!formData.value.gender &&
    !errors.value.password &&
    formData.value.password &&
    formData.value.confirmPassword &&
    !errors.value.confirmPassword &&
    (formData.value.reason || '').trim().length >= 10;

  const hasErrors = Object.values(errors.value).some((e) => e);
  return !requiredOk || hasErrors;
});

const handleSubmit = () => {
  // run validations before submit
  validateName(true);
  validateGender(true);
  validatePassword(true);
  validateConfirmPassword();
  validateReason(true);
  if (isSubmitDisabled.value) return;

  submittedCards.value.push({ id: nextId++, ...formData.value });
  clearForm();
};

const clearForm = () => {
  formData.value = {
    username: '',
    gender: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    suburb: 'Clayton'
  };
  errors.value = { username: null, gender: null, password: null, confirmPassword: null, reason: null };
};

const removeCard = (index) => {
  submittedCards.value.splice(index, 1);
};


watch(submittedCards, (val) => {
  try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(val)); } catch {}
}, { deep: true });

watch(formData, (val) => {
  try { localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(val)); } catch {}
}, { deep: true });

onMounted(() => {

  try {
    const saved = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    if (Array.isArray(saved)) {
      submittedCards.value = saved;
      const maxId = saved.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
      nextId = maxId + 1;
    }
  } catch {}

  try {
    const draft = JSON.parse(localStorage.getItem(FORM_DRAFT_KEY) || 'null');
    if (draft && typeof draft === 'object') {
      formData.value = { ...formData.value, ...draft };
    }
  } catch {}
});

const clearSaved = () => {
  try {
    localStorage.removeItem(SUBMISSIONS_KEY);
    localStorage.removeItem(FORM_DRAFT_KEY);
  } catch {}
  submittedCards.value = [];
  clearForm();
};
</script>

<style scoped>
header h1 { letter-spacing: 0.3px; }
</style>