const express = require('express')
const child_process = require('child_process')
const fs = require('fs')
const crypto = require('crypto')
const app = express()
const PORT = process.env.PORT || 3000

// Setup the public folder to serve static files
app.use(express.static(__dirname + '/public'))

// Set up the middleware to parse request's with JSON body
app.use(express.json())

// POST /predict makes a prediction on the model and returns the prediction to client
app.post('/predict', (req, res) => {
    let encoded_img = req.body.image

    // Generate a unique ID for this request
    const id = crypto.randomBytes(12).toString('hex')
    const path = `../imgs/${id}.png`

    // Save the image
    fs.writeFile(path, encoded_img, {encoding : 'base64'}, (err) => {
        if (err) throw err

        // Run the Python script to predict on the image
        const python = child_process.spawn('python3',['CNN.py', path], {cwd : '../model/'})
        
        // Event listener for data to stdout
        python.stdout.on('data', (data) => {
            fs.unlink(path, (err) => {
                if (err) throw err
            })            
            res.json({label : data.toString()})
        })
    })
   

   
})

// Setup the server to listen to port
app.listen(PORT, () => {
    console.log('Server started...')
})
