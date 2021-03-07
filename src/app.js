// Built in modules
const path = require('path')
const express = require('express')
const hbs = require('hbs')

// My modules (loaded in from other places)
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

// Define paths for express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')


const app = express()

// setup handleBars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static dir to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Elad Schwartz'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Elad Schwartz'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        msg: 'This is the help center',
        title: 'Help',
        name: 'Elad Schwartz'
    })
})


/**
 * The main forecast fetching function
 */
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData.data,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('page_not_found', {
        title: '404',
        msg: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('page_not_found', {
        title: '404',
        msg: 'Page Not found'
    })
})


// Used to set up the initial page
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})