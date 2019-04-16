const app = require('express')();
const users = require('./utils/users');
const jwt = require('jsonwebtoken');

app.post('/login' , (req , res) => {
    const password = '';
    const data = JSON.parse(JSON.stringify(req.body));
    users.users.find({
        raw : true,
        where : {
            name : data.name,
            password : data.password
        },
        include : [{
            model : users.users_details,
            where : { user_id : users.Sequelize.col('users.id') },
            attributes : ['image_path','original_image_path']
        }]
    }).then((users , err) => {
        if(users == null){
            res.status(403).json({
                message:  'name or password false',
                status : 'failure'
            })
        } else {
            let id = users.id;
            console.log(users);
            let image = users['users_detail.image_path']
            let token = jwt.sign({name : data.name , password : data.password},'superSecret',{});
            res.status(200).json({
                id : id,
                name : users['name'],
                image_path : image,
                message : 'login sucessfuly',
                status : 'success',
                token : token
            })
        }
    })
    console.log(password);
})
module.exports = app;