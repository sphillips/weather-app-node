const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up Handlebars engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(path.join(__dirname, '../public')))

// Define routes
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather app',
    name: 'Sean'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address.'
    })
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error })
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error })
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        })
      })
    }
  )
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term.'
    })
  }

  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    message: 'Help article not found.'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: 404,
    message: '404 page not found.'
  })
})

app.listen(port, () => {
  console.log('server is up on port ' + port)
})
