const app = require('express')();
const auth = require('./utils/auth');
const users = require('./utils/users');
const path = require('path');
const dir = path.join(__dirname , '../images/books_sold/');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , dir)
    },
    filename : (req , file , cb) => {
        cb(null , file.fieldname);
    }
});
const uploader = multer({
    storage : storage
}).single('upload_sold_books');

app.get('/sold_books' , auth , (req , res) => {
    users.sold_books.findAll({
        raw : true,
        attributes : ['id','user_id','book_id','book_name','count_book','total_price','status','users_sold','buyer','sold_at','image_path','original_image_path']
    }).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})

app.get('/sold_books/:id' , auth , (req , res) => {
    const id = req.params.id;
    users.sold_books.findById(id,{
        attributes : ['id','user_id','book_id','book_name','count_book','total_price','status','users_sold','buyer','sold_at','image_path','original_image_path']
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})

app.get('/sold_books/users/:user_id' , auth , (req , res) => {
    const user_id = req.params.user_id;
    users.sold_books.findAll({
        raw : true,
        where : {
            user_id : user_id
        },
        attributes : ['id','user_id','book_id','book_name','count_book','total_price','status','users_sold','buyer','sold_at','image_path','original_image_path']
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})

app.post('/sold_books' , auth , (req , res) => {
    uploader(req , res , (err) => {
        if(err){
            res.status(403).json(err);
        } else {
            const data = JSON.parse(req.body.json_data);
            fs.rename(dir + req.file.fieldname , dir + data.image_path , (err) => {
                if(err){
                    res.status(403).json(err);
                } else {
                    users.sold_books.create({
                        user_id : data.user_id,
                        book_id : data.book_id,
                        /*TextInputEditText*/
                        book_name : data.book_name,
                        /*TextInputEditText*/
                        count_book : data.count_book,
                        /*TextInputEditText*/
                        total_price : data.total_price,
                        status : data.status,
                        users_sold : data.users_sold,
                        /*TextInputEditText*/
                        buyer : data.buyer,
                        sold_at : data.sold_at,
                        image_path : data.image_path,
                        original_image_path : data.original_image_path
                    }).then(() => {
                        users.books.update({
                            count_book : data.result_count,
                            status : data.result_status
                        },{
                            where : {
                                id : data.book_id
                            }
                        }).then(() => {
                            res.status(200).json({
                                message : 'success'
                            })
                        }).catch((err) => {
                            console.log(err);
                            res.status(403).json(err);
                        })
                    }).catch((err) => {
                        res.status(403).json(err);
                    })
                }
            })
        }
    })
})

app.delete('/sold_books/:id' , auth , (req , res) => {
    const id = req.params.id;
    const data = JSON.parse(JSON.stringify(req.body));
    users.sold_books.destroy({where:{id : id}}).then(() => {
                res.status(200).json({
                    message : '1 data deleted',
                    status : 'success'
                })
            }).catch((err) => {
                res.status(403).json(err);
            })
})

module.exports = app;