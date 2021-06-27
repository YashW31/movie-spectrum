const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    movie_name:{
        type: String,
        required: true 
    },
    timestamp:{
        type: String,
        required: true 
    },
    genre: {
        type: String,
        required: true 
    },
    released_date: {
        type: String,
        required: true 
    },
    overview: {
        type: String,
        required: true 
    },
    rating: {
        type: String,
        required: true 
    },
    price: {
        type: String,
        required: true 
    },
    image:
	{
        type: String,
        required: true
	}
})

module.exports = mongoose.model("Movie" , movieSchema)