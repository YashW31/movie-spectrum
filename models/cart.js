const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    c_movie_name:{
        type: String,
        required: true 
    },
    c_timestamp:{
        type: String,
        required: true 
    },
    c_genre: {
        type: String,
        required: true 
    },
    c_released_date: {
        type: String,
        required: true 
    },
    c_overview: {
        type: String,
        required: true 
    },
    c_rating: {
        type: String,
        required: true 
    },
    c_image:
	{
        type: String,
        required: false
	},
    c_price: {
        type: String,
        required: true 
    },
    userId: {
        type: String,
        required: true,
    },
    movieId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Cart" , movieSchema)