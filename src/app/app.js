const express = require('express')
const child_process = require('child_process')
const fs = require('fs')
const { cwd } = require('process')
const app = express()

// Setup the public folder to serve static files
app.use(express.static('public'))

// Set up the middleware to parse request's with JSON body
app.use(express.json())

// POST /predict makes a prediction on the model and returns the prediction to client
app.post('/predict', (req, res) => {
    let encoded_img = req.body.image

    // Save the image
    fs.writeFileSync('../imgs/image.png', encoded_img, {encoding : 'base64'})

    // Run the Python script to predict on the image
    const python = child_process.spawnSync('python3',['CNN.py', '../imgs/image.png'], {
        cwd : '../model/'
    })

    console.log(python.stdout.toString())
})

// Setup the server to listen to port
app.listen(3000, () => {
    console.log('Server started...')
})
