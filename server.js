require("dotenv").config()
const express = require('express')
const app = express()
const path = require('path')
const logger = require("morgan")
const mongoose = require("mongoose")
const session = require("express-session")
const bcrypt = require("bcryptjs")

app.use(express.static(path.join(__dirname, "public")))
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

const User = require("./models/user")
const Movie = require("./models/movies")
const Like = require("./models/liked")
const Cart = require("./models/cart")

//session
app.use(session({
    secret: process.env.SECRET ,
    resave: true ,
    saveUninitialized:true,
}))

//ejs
app.set("view-engine" , "ejs");

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, 
}).then(() => console.log("DB connected"))
  .catch(error => console.log(error))


app.get("/" , (req , res) =>{
    message = null,
    res.render("login.ejs", {
        message: message
    })
})

app.post("/signup" , async (req,res) => {
    console.log(req.body)
    try{
        const new_user = new User({
            username : req.body.username,
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        User.findOne({username : req.body.username}).then((user) => {
            if(user){
                const message = "Username already exists. Please Sign in again"
                res.render("login.ejs", {
                    message: message
                })
            }
            else{
                new_user.save();
                res.redirect("/")
            }
        })
        
    } catch{
        res.redirect("/")
    }  
})


app.get("/home", checkauthentication, async (req , res) => {
    const user_movie = await Movie.find()
    const user_liked = await Like.find({ userId: req.session.user._id })
    res.render("index.ejs" , {
            user_movie: user_movie,
            user_liked: user_liked,
        })
    })

app.get("/admin",  checkauthentication, async (req , res) => {
    const admin_movie = await Movie.find()
    const admin_liked = await Like.find()
    res.render("admin.ejs" , {
            admin_movie: admin_movie,
            liked: admin_liked
        })
    })

//login post
app.post("/signin" , async (req, res) =>{
    await User.find({ username: req.body.username}).then(data => {
        const passmatch = bcrypt.compare(req.body.password, data[0].password)
        if(req.body.username == "admin"){
            req.session.user = data[0]
            res.redirect("/admin")
        }

        if(data == undefined){
             const message = "Username or password incorrect"
             console.log(message)
             res.render("login.ejs", {
                 message: message
            })
        }
         if(passmatch){
            req.session.user = data[0]
            res.redirect("/home")
        }
        else{
         const message = "Username or password incorrect"
         console.log(message)
         res.render("login.ejs", {
             message: message
         })
        }
    }).catch(e =>{
        console.log(e)
    })
})

//set up multer for storing uploaded files
var multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage });

// the GET request handler that provides the HTML UI
 
app.get('/',  checkauthentication, (req, res) => {
    movieModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});

app.get("/Create" ,  checkauthentication, (req , res) =>{
    res.render("create.ejs")
})

app.post('/Create', upload.single('image'), (req, res, next) => {
    const obj = new Movie({ 
        movie_name: req.body.movie_name,
        timestamp: req.body.timestamp,
        overview: req.body.overview,
        rating: req.body.rating,
        price: req.body.price,
        genre: req.body.genre,
        released_date: req.body.released_date,
        image: req.file.filename
    });
    obj.save();
    res.redirect("/admin")
});



//delete movie
app.post("/deletemovie/:id", async (req , res) =>{
    console.log("aala")
    await Movie.findByIdAndDelete({_id: req.params.id}).then(result =>{
        if(result){
            console.log("Movie deleted")
            res.redirect("/admin")
        }else{
            res.send("error")
        }
    }).catch(e => {
        res.send("error in catch")
    })
})

//edit movie Get
app.get("/editmovie/:id" ,  checkauthentication, async (req, res) =>{
    await Movie.findById(req.params.id).then( movie => {
        res.render("update.ejs" , {
            movie: movie 
        })
    })
})

//edit movie post
app.post("/updatemovie/:id" , async(req , res) =>{
    console.log(req.body)
    await Movie.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            movie_name: req.body.movie_name,
            timestamp: req.body.timestamp,
            overview: req.body.overview,
            rating: req.body.rating,
            price: req.body.price,
            genre: req.body.genre,
            released_date: req.body.released_date 
        }
    }, {new: true}).then(result => {
        if(result){
            console.log(result)
            console.log("Movie updated")
            res.redirect("/admin")
        }else{
            res.send("error")
        }
    }).catch(e => {
        console.log(e)
        res.send("error in catch")
    })
})

app.get("/mainmovie/:id" ,  checkauthentication, async (req , res) =>{
    await Movie.findById(req.params.id).then( movie => {
            res.render("main-movie.ejs" , {
                movie: movie 
            })
        })
})

app.get("/adminmovie/:id" ,  checkauthentication, async (req , res) =>{
    await Movie.findById(req.params.id).then( movie => {
            res.render("admin-movie.ejs" , {
                movie: movie 
            })
        })
})

app.get("/movies",  checkauthentication, async (req , res) => {
    await Movie.find().then(movie => {
        // console.log(blog)
        res.render("movies.ejs" , {
            movie: movie,
        })
    }).catch(e => {
        console.log(e)
    }) 
})

app.get("/admin-movie-list",  checkauthentication, async (req , res) => {
    await Movie.find().then(movie => {
        // console.log(blog)
        res.render("admin-movie-list.ejs" , {
            movie: movie,
        })
    }).catch(e => {
        console.log(e)
    }) 
})

app.get("/fav",  checkauthentication, async (req , res) => {
    await Like.find({ userId: req.session.user._id }).then(like => {
        res.render("fav.ejs" , {
            movie: like
        })
    }).catch(e => {
        console.log(e)
    }) 
})

app.get("/addtofavourites/:id" ,  checkauthentication, upload.single('image'), async (req , res) => {
    await Movie.findById(req.params.id).then(movie => {
        try{
            const object = new Like({ 
                userId: req.session.user._id,
                f_movie_name: movie.movie_name,
                f_price: movie.price,
                f_released_date: movie.released_date,
                f_timestamp: movie.timestamp,
                f_genre: movie.genre,
                f_overview: movie.overview,
                f_rating: movie.rating,
                f_image: movie.image,
                movieId: movie.id
            })
            object.save();
            res.redirect("/fav")
    } catch (error){
        console.log(error)
        res.send("error")
    } 
  })
})

//delete fav
app.post("/removefavourites/:id", async (req , res) =>{
    await Like.findByIdAndDelete({_id: req.params.id}).then(result =>{
        if(result){
            res.redirect("/home")
        }else{
            res.send("error")
        }
    }).catch(e => {
        console.log(e)
        res.send("error in catch")
    })
})

app.get("/cart",  checkauthentication, async (req , res) => {
    await Cart.find({ userId: req.session.user._id }).then(cart => {
        var total = 0
        for(i in cart){
            total += Number(cart[i].c_price)
        }
        res.render("cart.ejs" , {
            movie: cart,
            total: total,
        })
    }).catch(e => {
        console.log(e)
    }) 
})

app.get("/addtocart/:id" ,  checkauthentication, upload.single('image'), async (req , res) => {
    await Movie.findById(req.params.id).then(cart => {
        try{
            const object = new Cart({ 
                userId: req.session.user._id,
                c_movie_name: cart.movie_name,
                c_price: cart.price,
                c_released_date: cart.released_date,
                c_timestamp: cart.timestamp,
                c_genre: cart.genre,
                c_overview: cart.overview,
                c_rating: cart.rating,
                c_image: cart.image,
                movieId: cart.id
            })
            object.save();
            res.redirect("/cart")
    } catch (error){
        console.log(error)
        res.send("error")
    } 
  })
})

//delete fav
app.post("/removecart/:id", async (req , res) =>{
    await Cart.findByIdAndDelete({_id: req.params.id}).then(result =>{
        if(result){
            res.redirect("/cart")
        }else{
            res.send("error")
        }
    }).catch(e => {
        console.log(e)
        res.send("error in catch")
    })
})

app.get("/search" ,  checkauthentication, (req , res) =>{
    movie = {},
    res.render("search.ejs", {
        movie: movie
    })
})

app.post("/search", function(req,res){
    var regex = new RegExp(req.body.movie_name, 'i')
    Movie.find({movie_name: regex}).then((result)=>{
        res.render("search.ejs", {
            movie: result
        })
    })
})

app.post("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

//middleware
function checkauthentication(req, res, next) {
    if(req.session.user){
        return next()
    }else {
        res.redirect("/")
    }
}

app.listen(3000, () => {
    console.log("Listening on port 3000")
})