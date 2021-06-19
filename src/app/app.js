const express = require('express')
const fs = require('fs')
const app = express()

// Setup the public folder to serve static files
app.use(express.static('public'))

// Set up the middleware to parse request's with JSON body
app.use(express.json())

// POST /predict makes a prediction on the model and returns the prediction to client
app.post('/predict', (req, res) => {
    let encoded_img = req.body.image

    // Save the image
    fs.writeFileSync('image.png', encoded_img, {encoding : 'base64'}, err => {
        if (err) throw err
        console.log('File saved!')
    })
})

// Setup the server to listen to port
app.listen(3000, () => {
    console.log('Server started...')
})
