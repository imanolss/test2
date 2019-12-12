const router = require('express').Router()
const User = require('../models/User')
const passport = require('../config/passport')

const ensureLogin = router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign up',
    action: '/signup',
    button: 'Sign up',
    register: true
  }
  res.render('auth/form', config)
})

//ruta para registrar usuarios
router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('El usuario ya existe')
  }
})

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Log in',
    action: '/login',
    button: 'Log in'
  }
  res.render('auth/form', config)
})

//para logear al usario
router.post('/login', passport.authenticate('local', { failureRedirect: '/signup' }), (req, res, next) => {
  console.log(req.user, req.session)
  res.redirect('/profile')
})

//acceder al perfil del usuario
router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('auth/profile', { user: req.user })
})

//cerrar sesión
router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

router.get('/update', isLoggedIn, (req, res, next) => {
  const currentUser =  req.user 
  console.log('-----------------------------------'+ currentUser)
  const config = {
    title: 'Actualiza el perfil',
    action: '/update',
    button: 'Update   '
  }
  res.render('auth/update', { currentUser, config })
})

router.post('/update', async (req, res, next) => {
  try {
    const currentUser = req.user
    const { edad, estatura, peso, GEB } = req.body
    const updatedUser = {edad, estatura, peso, GEB}
    await User.findByIdAndUpdate(currentUser, updatedUser)
    res.redirect('/profile')
  } catch (e) {
    console.log(e)
  }
})

//Permite que se pueda solo con cuando está loggeado
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports = router
