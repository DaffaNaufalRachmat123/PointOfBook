const app = require('express')();
const books = require('./utils/users');
const auth = require('./utils/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname , '../images/books_list/');
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , path.join(__dirname , '../images/books_list/'));
    },
    filename : (req , file , cb) => {
        cb(null , file.fieldname);
    }
});
const uploader = multer({
    storage : storage
}).single('upload_books');

app.get('/books' , auth , (req , res) => {
    books.books.findAll({
        attributes : ['id','user_id','book_name','count_book','price_book','status','image_path','original_image_path','created_at']
    }).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})
app.get('/books/users/:id' , auth , (req , res) => {
    const id = req.params.id;
    books.books.findAll({
        where : {
            user_id : id
        },
        raw : true
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})
app.get('/books/:id' , auth , (req , res) => {
    let id = req.params.id;
    books.books.findById(id,{
        attributes : ['id','user_id','book_name','count_book','price_book','status','image_path','original_image_path','created_at']
    }).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})

app.post('/books' , auth , (req , res) => {
    uploader(req , res , (err) => {
        if(err){
            res.status(403).json(err);
        } else {
            const data = JSON.parse(req.body.json_data);
            fs.rename(dir + req.file.fieldname , dir + data.image_path , (err) => {
                if(err){
                    res.status(403).json(err);
                } else {
                    books.books.create({
                        user_id : data.user_id,
                        book_name : data.book_name,
                        count_book : data.count_book,
                        price_book : data.price_book,
                        status : data.status,
                        image_path : data.image_path,
                        original_image_path : data.original_image_path,
                        created_at : data.created_at
                    }).then(() => {
                        res.status(200).json({
                            message : '1 data affected',
                            status : 'success'
                        })
                    }).catch((err) => {
                        res.status(403).json(err);
                    })
                }
            })
        }
    })
})

app.put('/books' , auth , (req , res) => {
    let headers = req.headers['x-image'];
    if(headers == "no image"){
        const data = JSON.parse(JSON.stringify(req.body));
        books.books.update({
            book_name : data.book_name,
            count_book : data.count_book,
            price_book : data.price_book,
            status : data.status
        },{
            where : {
                id : data.id
            }
        }).then(() => {
            res.status(200).json({
                message : '1 data updated',
                status : 'success'
            })
        })
    } else {
        uploader(req , res , (err) => {
            if(err){
                res.status(403).json(err);
            } else {
                const data = JSON.parse(req.body.json_data);
                fs.rename(dir + req.file.fieldname , dir + data.image_path , (err) => {
                            if(err){
                                res.status(403).json(err);
                            } else {
                                books.books.update({
                                    book_name : data.book_name,
                                    count_book : data.count_book,
                                    price_book : data.price_book,
                                    status : data.status,
                                    image_path : data.image_path,
                                    original_image_path : data.original_image_path
                                },{
                                    where : {
                                        id : data.id
                                    }
                                }).then(() => {
                                    res.status(200).json({
                                        message : '1 data updated',
                                        status : 'success'
                                    })
                                }).catch((err) => {
                                    res.status(403).json(err);
                                })
                            }
                        })
            }
        })
    }
})

app.delete('/books/:id' , auth , (req , res) => {
    const id = req.params.id;
    books.books.destroy({where:{id:id}}).then(() => {
                res.status(200).json({
                    message : 'all data with id : ' + id + ' deleted ',
                    status : 'success'
                })
            }).catch((err) => {
                res.status(403).json(err);
            })
})

module.exports = app;