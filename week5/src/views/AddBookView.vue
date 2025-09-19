<template>
    <div>
      <h1>Book Manager</h1>
      
      <!-- Add/Edit Book Form -->
      <form @submit.prevent="saveBook">
        <h2>{{ editingBook ? 'Edit Book' : 'Add Book' }}</h2>
        <div>
          <label for="isbn">ISBN:</label>
          <input type="text" v-model="isbn" id="isbn" required />
        </div>
        <div>
          <label for="name">Name:</label>
          <input type="text" v-model="name" id="name" required />
        </div>
        <button type="submit">{{ editingBook ? 'Update Book' : 'Add Book' }}</button>
        <button type="button" @click="cancelEdit" v-if="editingBook">Cancel</button>
      </form>
  
      <!-- Controls -->
      <div class="controls">
        <div>
          <label for="sortBy">Sort by:</label>
          <select v-model="sortBy" @change="loadBooks">
            <option value="name">Name</option>
            <option value="isbn">ISBN</option>
          </select>
          
          <label for="sortOrder">Order:</label>
          <select v-model="sortOrder" @change="loadBooks">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        
        <div>
          <label for="limit">Limit:</label>
          <select v-model="bookLimit" @change="loadBooks">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <button @click="loadBooks">Refresh</button>
      </div>
  
      <!-- Books List -->
      <div class="books-list">
        <h2>Books ({{ books.length }})</h2>
        <div v-if="books.length === 0" class="no-books">
          No books found
        </div>
        <div v-for="book in books" :key="book.id" class="book-item">
          <div class="book-info">
            <strong>{{ book.name }}</strong>
            <span>ISBN: {{ book.isbn }}</span>
          </div>
          <div class="book-actions">
            <button @click="editBook(book)">Edit</button>
            <button @click="deleteBook(book.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import db from '../firebase/init.js'
  import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    limit 
  } from 'firebase/firestore';
  
  export default {
    setup() {
      const isbn = ref('');
      const name = ref('');
      const books = ref([]);
      const editingBook = ref(null);
      const sortBy = ref('name');
      const sortOrder = ref('asc');
      const bookLimit = ref(10);
  
      // Load books with sorting and limiting
      const loadBooks = async () => {
        try {
          const booksCollection = collection(db, 'books');
          const q = query(
            booksCollection,
            orderBy(sortBy.value, sortOrder.value),
            limit(parseInt(bookLimit.value))
          );
          
          const querySnapshot = await getDocs(q);
          books.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log(`Loaded ${books.value.length} books`);
        } catch (error) {
          console.error('Error loading books: ', error);
          alert('Error loading books');
        }
      };
  
      // Add or update book
      const saveBook = async () => {
        try {
          const isbnNumber = Number(isbn.value);
          if (isNaN(isbnNumber)) {
            alert('ISBN must be a valid number');
            return;
          }
  
          const bookData = {
            isbn: isbnNumber,
            name: name.value
          };
  
          if (editingBook.value) {
            // Update existing book
            await updateDoc(doc(db, 'books', editingBook.value.id), bookData);
            alert('Book updated successfully!');
            console.log('Book updated:', bookData);
          } else {
            // Add new book
            await addDoc(collection(db, 'books'), bookData);
            alert('Book added successfully!');
            console.log('Book added:', bookData);
          }
          
          // Reset form and reload books
          resetForm();
          loadBooks();
        } catch (error) {
          console.error('Error saving book: ', error);
          alert('Error saving book');
        }
      };
  
      // Edit book
      const editBook = (book) => {
        editingBook.value = book;
        isbn.value = book.isbn.toString();
        name.value = book.name;
        console.log('Editing book:', book);
      };
  
      // Cancel edit
      const cancelEdit = () => {
        resetForm();
      };
  
      // Delete book
      const deleteBook = async (bookId) => {
        if (!confirm('Are you sure you want to delete this book?')) {
          return;
        }
  
        try {
          await deleteDoc(doc(db, 'books', bookId));
          alert('Book deleted successfully!');
          console.log('Book deleted:', bookId);
          loadBooks();
        } catch (error) {
          console.error('Error deleting book: ', error);
          alert('Error deleting book');
        }
      };
  
      // Reset form
      const resetForm = () => {
        isbn.value = '';
        name.value = '';
        editingBook.value = null;
      };
  
      // Load books on component mount
      onMounted(() => {
        loadBooks();
      });
  
      return {
        isbn,
        name,
        books,
        editingBook,
        sortBy,
        sortOrder,
        bookLimit,
        saveBook,
        editBook,
        cancelEdit,
        deleteBook,
        loadBooks
      };
    }
  };
  </script>
  
  <style scoped>
  form {
    background: #f5f5f5;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  
  form div {
    margin-bottom: 10px;
  }
  
  label {
    display: inline-block;
    width: 80px;
    font-weight: bold;
  }
  
  input, select {
    padding: 5px;
    margin-left: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  button {
    padding: 8px 15px;
    margin: 5px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  button[type="submit"] {
    background: #007bff;
    color: white;
  }
  
  button[type="button"] {
    background: #6c757d;
    color: white;
  }
  
  .delete-btn {
    background: #dc3545;
    color: white;
  }
  
  .controls {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: #e9ecef;
    border-radius: 5px;
  }
  
  .books-list {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
  }
  
  .book-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .book-item:last-child {
    border-bottom: none;
  }
  
  .book-info {
    display: flex;
    flex-direction: column;
  }
  
  .book-info span {
    color: #666;
    font-size: 0.9em;
  }
  
  .book-actions {
    display: flex;
    gap: 5px;
  }
  
  .no-books {
    text-align: center;
    color: #666;
    padding: 20px;
  }
  
  h1, h2 {
    color: #333;
  }
  </style>