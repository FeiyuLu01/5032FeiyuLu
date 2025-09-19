<template>
    <div class="container mt-4">
        <h1>Books with ISBN > 1000 </h1>

        <!-- Query Buttons -->
        <div class="mb-3">
            <button @click="fetchBooks('where')" class="btn btn-primary me-2">WHERE: ISBN > 1000</button>
            <button @click="fetchBooks('order')" class="btn btn-primary me-2">ORDER BY: Name ASC</button>
            <button @click="fetchBooks('limit')" class="btn btn-primary">LIMIT: 5 books</button>
        </div>

        <!-- Books List -->
        <div class="card">
            <div class="card-header">
                <h5>Books ({{ books.length }} found)</h5>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ISBN</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="book in books" :key="book.id">
                            <td>
                                <input v-if="editingBook === book.id" v-model="editForm.name" class="form-control">
                                <span v-else>{{ book.name }}</span>
                            </td>
                            <td>
                                <input v-if="editingBook === book.id" v-model="editForm.isbn" class="form-control">
                                <span v-else>{{ book.isbn }}</span>
                            </td>
                            <td>
                                <div v-if="editingBook === book.id">
                                    <button @click="saveBook(book.id)" class="btn btn-success btn-sm me-1">Save</button>
                                    <button @click="cancelEdit" class="btn btn-secondary btn-sm">Cancel</button>
                                </div>
                                <div v-else>
                                    <button @click="editBook(book)" class="btn btn-warning btn-sm me-1">Edit</button>
                                    <button @click="deleteBook(book.id)" class="btn btn-danger btn-sm">Delete</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
    </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import db from '../firebase/init'
import { collection, query, where, getDocs, limit, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default {
    setup() {
        const books = ref([])
        const message = ref('')
        const editingBook = ref(null)
        const editForm = ref({ name: '', isbn: '' })

        const fetchBooks = async (queryType) => {
            try {
                let q = collection(db, 'books')

                if (queryType === 'where') {
                    q = query(q, where('isbn', '>', 1000))
                } else if (queryType === 'order') {
                    q = query(q, orderBy('name', 'asc'))
                } else if (queryType === 'limit') {
                    q = query(q, limit(5))
                }

                const querySnapshot = await getDocs(q)
                const booksArray = []
                querySnapshot.forEach((doc) => {
                    booksArray.push({ id: doc.id, ...doc.data() })
                })
                books.value = booksArray
            } catch (e) {
                console.error('Error:', e)
            }
        }

        // Edit book
        const editBook = (book) => {
            editingBook.value = book.id
            editForm.value = { name: book.name, isbn: book.isbn }
        }

        // Save book
        const saveBook = async (bookId) => {
            try {
                await updateDoc(doc(db, 'books', bookId), {
                    name: editForm.value.name,
                    isbn: parseInt(editForm.value.isbn)
                })
                editingBook.value = null
                message.value = 'Book updated!'
                fetchBooks('where')
            } catch (e) {
                console.error('Error updating:', e)
            }
        }

        // Cancel edit
        const cancelEdit = () => {
            editingBook.value = null
        }

        // Delete book
        const deleteBook = async (bookId) => {
            if (confirm('Delete this book?')) {
                try {
                    await deleteDoc(doc(db, 'books', bookId))
                    books.value = books.value.filter(book => book.id !== bookId)
                    message.value = 'Book deleted!'
                    fetchBooks('where')
                } catch (e) {
                    console.error('Error deleting:', e)
                }
            }
        }

        onMounted(() => {
            fetchBooks('where')
        })

        return {
            books, message, editingBook, editForm,
            fetchBooks, editBook, saveBook, cancelEdit, deleteBook
        }
    }
}
</script>