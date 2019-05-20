const mongoose = require('mongoose')

//define the schema for our user model

/*==============================================================*/
const userSchema = new mongoose.Schema({
	_id:String,
    name: String,
	mail: String,
    status: String,
    questions: Array,
})

module.exports = mongoose.model('user', userSchema, 'user');
