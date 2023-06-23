import express from "express"
import mysql from "mysql"
import cors from "cors"
import multer from "multer"
import path from "path"

// create our app
const app = express()

// let json object be sent to our express server
app.use(express.json())

// add cors to enable front end to get data
app.use(cors())

// Connect to DB
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "react"
})


app.get("/", (req, res) => {
    res.send("Hello this the backend")
})

// get all books
app.get("/books", (req, res) => {
    const query = "select * from books"
    db.query(query, (err, result) => {
        if (err) return res.json(err)
        res.send(result)
    })
})

//get book by id
app.get("/book/:id", (req, res) => {
    const query = "SELECT * FROM books WHERE id = ?";
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.json({ error: err }); // Handle the error and send it as JSON
        }

        if (result.length === 0) {
            return res.json({ message: "Book not found" }); // Handle the case when no book is found
        }

        const book = result[0]; // Assuming you expect a single book with the given id
        res.json(book); // Send the book as JSON response
    });
});

// add a new book
app.post("/books", (req, res) => {
    const query = "INSERT INTO books (`title`, `desc`, `cover`,`price`) VALUES (?)"

    const values = [
        req.body.title,
        req.body.desc,
        req.body.cover,
        req.body.price
    ]
    db.query(query, [values], (err, result) => {
        if (err) return res.json(err)
        res.send("book has been created successfully")
    })
})

//delete book
app.delete("/books/:id", (req, res) => {
    const query = "DELETE FROM books WHERE id = ?"
    db.query(query, [req.params.id], (err, result) => {
        if (err) return res.json(err)
        res.send("book has been deleted successfully")
    })
})

//update a book
app.put("/book/:id", (req, res) => {
    const bookId = req.params.id;
    const query = "UPDATE books SET `title` = ?, `desc` = ?, `cover` = ?, `price` = ? WHERE id = ?"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.cover,
        req.body.price,
    ]
    db.query(query, [...values, bookId], (err, result) => {
        if (err) return res.json(err)
        res.send("book has been updated successfully")
    })
})


// Set up multer storage for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/public/images'); // Set the destination folder for saving images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueSuffix + fileExtension); // Set the filename for the saved image
    },
});

// Create a multer instance with the configured storage
const upload = multer({ storage });

// Route handler for handling image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = '/images/' + req.file.filename; // Generate the URL for the saved image

    // Save the imageUrl to the database or perform any other necessary operations

    // Return the URL of the saved image
    res.json({ imageUrl });
});


//backend port
app.listen(8800, () => {
    console.log("Server is running on port 8800")
})