// Book class: rep. a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: handle ui tasks
class UI {
    static displayBooks() {
        const StoredBooks = Store.getBooks();

        const books = StoredBooks;

        books.forEach((book) => {
            return UI.addBookToList(book);
        });
    }
    static addBookToList(book) {
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        el.remove();
    }

    static showAlert(msg, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);
        // vanish in 3 seconds
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 2000);
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}

// Store class: handles storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    // prevent actual submit
    e.preventDefault();
    // get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate
    if (title === "" || author === "" || isbn === "") {
        return UI.showAlert("Please fill in all fields", "danger");
    }

    // instantiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // show success message
    UI.showAlert("Book Added", "success");

    // clear fields
    UI.clearFields();
});

// Event: remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        // remove from UI
        UI.deleteBook(e.target.parentElement.parentElement);
        //remove from store
        Store.removeBook(e.target.parentElement.parentElement.children[2].innerText);
        // show alert
        UI.showAlert("Book Removed", "success");
    }
});
