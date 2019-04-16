const app = require('express')();
const users = require('./utils/users');
const auth = require('./utils/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
let dir = path.join(__dirname , '../images/');
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , dir);
    },
    filename : (req , file , cb) => {
        cb(null , file.fieldname);
    }
})
const uploader = multer({
    storage : storage
}).single('upload_image');

app.get('/users' , auth , (req , res) => {
    users.users.findAll({
        attributes : ['id','email','name','password','sekolah'],
        include : [
            {
                model : users.users_details,
                where : { user_id : users.Sequelize.col('users.id') },
                attributes : ['kelamin','image_path','original_image_path']
            }
        ]
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})
app.get('/users/:id' , auth , (req , res) => {
    const id = req.params.id;
    users.users.findById(id,{
        attributes : ['id','email','name','password','sekolah'],
        include : [
            {
                model : users.users_details,
                where : { user_id : users.Sequelize.col('users.id') },
                attributes : ['kelamin','image_path','original_image_path']
            }
        ]
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(403).json(err);
    })
})
app.post('/users' , (req , res) => {
    uploader(req , res , (err) => {
        if(err){
            res.status(403).json(err);
        } else {
            const data = JSON.parse(req.body.json_data);
            console.log(data);
            fs.rename(dir + req.file.fieldname , dir + data.image_path , (err) => {
                if(err){
                    res.status(403).json(err);
                } else {
                    users.users.create({
                        id : data.id,
                        email : data.email,
                        name : data.name,
                        password : data.password,
                        sekolah : data.sekolah
                    }).then(() => {
                        users.users_details.create({
                            user_id : data.id,
                            kelamin : data.kelamin,
                            image_path : data.image_path,
                            original_image_path : data.original_image_path
                        }).then(() => {
                            res.status(200).json({
                                message : 'Table Affected',
                                status : 'success'
                            })
                        }).catch((err) => {
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

app.put('/users' , auth , (req , res) => {
    let headers = req.headers['x-image'];
    if(headers == "no image"){
        const data = JSON.parse(JSON.stringify(req.body));
        users.users.update({
            email : data.email,
            name : data.name,
            password : data.password,
            sekolah : data.sekolah
        },{
            where : {
                id : data.id
            }
        }).then(() => {
            users.users_details.update({
                kelamin : data.kelamin
            },{
                where : {
                    user_id : data.id
                }
            }).then(() => {
                res.status(200).json({
                    message : 'Data Updated',
                    status : 'success'
                })
            }).catch((err) => {
                res.status(403).json(err);
            })
        }).catch((err) => {
            res.status(403).json(err);
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
                                users.users.update({
                                    email : data.email,
                                    name : data.name,
                                    password : data.password,
                                    sekolah : data.sekolah
                                },{
                                    where : {
                                        id : data.id
                                    }
                                }).then(() => {
                                    users.users_details.update({
                                        kelamin : data.kelamin,
                                        image_path : data.image_path,
                                        original_image_path : data.original_image_path
                                    },{
                                        where : {
                                            user_id : data.id
                                        }
                                    }).then(() => {
                                        res.status(200).json({
                                            message : '1 data updated',
                                            status : 'success'
                                        })
                                    }).catch((err) => {
                                        res.status(403).json(err);
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

app.delete('/users/:id' , auth , (req , res) => {
    let id = req.params.id;
    users.users.destroy({
        where : {
            id : id
        }
    }).then(() => {
        res.status(200).json({
            message : 'data deleted',
            status : 'success'
        })
    }).catch((err) => {
        res.status(403).json(err);
    })
})
console.log(dir);
module.exports = app;