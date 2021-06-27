const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    f_movie_name:{
        type: String,
        required: true 
    },
    f_timestamp:{
        type: String,
        required: true 
    },
    f_genre: {
        type: String,
        required: true 
    },
    f_released_date: {
        type: String,
        required: true 
    },
    f_overview: {
        type: String,
        required: true 
    },
    f_rating: {
        type: String,
        required: true 
    },
    f_image:
	{
        type: String,
        required: false
	},
    f_price: {
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

module.exports = mongoose.model("Like" , movieSchema)