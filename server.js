const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const login = require('./routes/login');
const user = require('./routes/user');
const books = require('./routes/books');
const sold_books = require('./routes/sold_books');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(login);
app.use(user);
app.use(books);
app.use(sold_books);

app.use(express.static(path.join(__dirname , './images/')));
app.use(express.static(path.join(__dirname , './images/books_list')));
app.use(express.static(path.join(__dirname , './images/books_sold')));

const data = [
	{
		"suami" : "Daffa Naufal Rachmat",
		"istri" : "Noviyana"
	}
]
app.get('/secret' , (req , res) => res.json(data));
app.listen(process.env.PORT || 2300);