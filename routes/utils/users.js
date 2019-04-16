const Sequelize = require('sequelize');
const db = new Sequelize('pt_database','dnstark123','Naufal_Inside123',{
    host : '85.10.205.173',
    dialect : "mysql",
    port : 3306
});
const users = db.define('users',{
    id : {
        type : Sequelize.INTEGER(11),
        primaryKey : true,
        allowNull : false
    },
    email : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    name : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    password : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    sekolah : {
        type : Sequelize.STRING(255),
        allowNull : false
    }
},{
    timestamps : false
})
const users_details = db.define('users_details',{
    id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    user_id : {
        type : Sequelize.INTEGER(11),
        allowNull : false,
        unique : true
    },
    kelamin : Sequelize.STRING(255),
    image_path : Sequelize.STRING(255),
    original_image_path : Sequelize.STRING(255)
},{
    timestamps : false
})
const books = db.define('books',{
    id : {
        type : Sequelize.INTEGER(11),
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    user_id : {
        type : Sequelize.INTEGER(11),
        allowNull : false
    },
    book_name : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    count_book : {
        type : Sequelize.INTEGER(11),
        allowNull : false
    },
    price_book : {
        type : Sequelize.INTEGER(11),
        allowNull : false
    },
    status : {
        type : Sequelize.STRING(30),
        allowNull : false
    },
    image_path : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    original_image_path : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    created_at : {
        type : Sequelize.STRING(200),
        allowNull : false
    }
},{
    timestamps : false
})
const sold_books = db.define('sold_books',{
    id : {
        type : Sequelize.INTEGER(11),
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    user_id : {
        type : Sequelize.INTEGER(11),
        allowNull : false
    },
    book_id : {
        type : Sequelize.INTEGER(11),
        allowNull : false
    },
    book_name : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    count_book : {
        type : Sequelize.INTEGER(11),
        allowNull : false
    },
    total_price : {
        type : Sequelize.INTEGER(11),
        allowNull : false
    },
    status : {
        type : Sequelize.STRING(30),
        allowNull : false
    },
    users_sold : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    buyer : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    sold_at : {
        type : Sequelize.STRING(200),
        allowNull : false
    },
    image_path : {
        type : Sequelize.STRING(255),
        allowNull : false
    },
    original_image_path : {
        type : Sequelize.STRING(255),
        allowNull : false
    }
},{
    timestamps : false
});

users.hasOne(users_details , {foreignKey : 'user_id'});
users_details.belongsTo(users,{foreignKey : 'user_id',targetKey : 'id'});
users.hasMany(books , {foreignKey : 'user_id' , sourceKey : 'id'});
books.belongsTo(users , {foreignKey : 'user_id',targetKey : 'id'});
users.hasMany(sold_books , {foreignKey : 'user_id',sourceKey : 'id'});
sold_books.belongsTo(users , {foreignKey : 'user_id',targetKey : 'id'});

users.sync().then(() => console.log('[+]Table Users Created[+]')).catch((err) => console.error(err));
users_details.sync().then(() => console.log('[+]Table Users Details Created[+]')).catch((err) => console.error(err));
books.sync().then(() => console.log('[+]Table Books Created[+]')).catch((err) => console.error(err));
sold_books.sync().then(() => console.log('[+]Table Sold Books Created[+]')).catch((err) => console.error(err));

module.exports = {
    users,
    users_details,
    books,
    sold_books,
    Sequelize
}