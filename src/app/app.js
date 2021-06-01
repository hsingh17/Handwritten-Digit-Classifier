const express = require('express')
const app = express()

// Setup the public folder to serve static files
app.use(express.static('public'))

// Post route for predicting on the model
app.post('/predict', (req, res) => {
    console.log(req.params.id)
})

// Setup the server to listen to port
app.listen(3000, () => {
    console.log('Server started...')
})
