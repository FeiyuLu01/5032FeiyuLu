<template>
    <div>
      <h1>{{ isLogin ? 'Login' : 'Register' }}</h1>
      
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      
      <div v-if="!isLogin">
        <label>
          <input type="radio" v-model="role" value="user" /> User
        </label>
        <label>
          <input type="radio" v-model="role" value="admin" /> Admin
        </label>
      </div>
      
      <button @click="handleAuth">
        {{ isLogin ? 'Login' : 'Register' }}
      </button>
      
      <button @click="logout" v-if="user">Logout</button>
      
      <p>
        <a href="#" @click.prevent="isLogin = !isLogin">
          {{ isLogin ? 'Need to register?' : 'Already have account?' }}
        </a>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue"
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
  import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
  
  const email = ref("")
  const password = ref("")
  const role = ref("user")
  const isLogin = ref(true)
  const user = ref(null)
  
  const auth = getAuth()
  const db = getFirestore()
  
  const handleAuth = async () => {
    try {
      if (isLogin.value) {
        // Login
        const result = await signInWithEmailAndPassword(auth, email.value, password.value)
        user.value = result.user
        
        // Get user role
        const userDoc = await getDoc(doc(db, "users", result.user.uid))
        const userRole = userDoc.data()?.role || "user"
        
        console.log("Login successful!")
        console.log("User:", result.user)
        console.log("Role:", userRole)
        
      } else {
        // Register
        const result = await createUserWithEmailAndPassword(auth, email.value, password.value)
        user.value = result.user
        
        // Save role to Firestore
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          role: role.value
        })
        
        console.log("Registration successful!")
        console.log("User:", result.user)
        console.log("Role:", role.value)
      }
      
      // Clear form
      email.value = ""
      password.value = ""
      
    } catch (error) {
      console.log("Error:", error.message)
    }
  }
  
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      console.log("Logout successful!")
    } catch (error) {
      console.log("Logout error:", error.message)
    }
  }
  </script>
  
  <style scoped>
  div {
    max-width: 300px;
    margin: 50px auto;
    padding: 20px;
  }
  
  input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px;
  }
  
  button {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  label {
    margin: 5px;
  }
  </style>