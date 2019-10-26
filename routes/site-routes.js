const express = require("express");
const router = express.Router();

const Animal = require("../models/Animal");
const User = require("../models/User");

//renderiz ala plantilla home.hbs
router.get("/", (req, res, next) => {
  res.render("home");
});


// verificamiso si el usuario tiene una session activa, de ser asi, lo redirigimos a la siguiente ruta
// en este caso, /secret, en caso contrario redirigimos al usuario a /login
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route 
  } else {                          
    res.redirect("/login");        
  }                                
});    

// renderizamos la plantilla secret.hbs con el username , deconstruimos en la variable username el username de request
// session de currentUser
   

router.get('/profile', (req,res,next)=>{
  const user = req.session.currentUser;
  const animalId=user.animal;
  Animal.findById(animalId)
  .then((animal)=>{
    res.render("profile", {user,animal})
  })
 
}) 



router.get('/edit', (req,res,next)=>{
  const userId =req.session.currentUser._id;
   User.findById(userId)
  .then((user)=>{
    res.render('auth/edituser',{user}) 
  })
})


router.post('/edit', (req,res,next)=>{
  const userId=req.session.currentUser._id;
  const {name,mail}= req.body;
  User.findByIdAndUpdate({_id:userId}, { $set:{name,mail}}, {new:true})
  .then((user)=>{
    res.redirect("/users/profile")
  })
  .catch ((error)=>{
    console.log(error)
  })
})


module.exports = router;