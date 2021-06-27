
// <----------------------- CONSTANTS ----------------------->
const body = document.getElementsByTagName('body')[0],
    canvas = document.getElementById('canvas'),
    label_span = document.getElementById('label'),
    clear_btn = document.getElementById('clear-btn'),
    predict_btn = document.getElementById('predict-btn'),
    btn_container_height = document.getElementById('btns-container').offsetHeight,
    ctx = canvas.getContext('2d'),
    N = 4,
    M = 2,
    DPI = window.devicePixelRatio,
    width = Math.max(384, window.innerWidth / N), 
    height  = Math.max(344, window.innerHeight / M)

// <----------------------- VARIABLES ----------------------->
let width_offset = (window.innerWidth / 2) - (width / 2),
    height_offset = ((window.innerHeight / 2) - (btn_container_height / 2)) - (height / 2),
    mouse_down = false,
    prev_x = -1,
    prev_y = -1

// <----------------------- CANVAS WIDTH & HEIGHT ----------------------->
canvas.width = width * DPI
canvas.height = height * DPI    
canvas.style.width = width + 'px'
canvas.style.height = height + 'px'
ctx.scale(DPI, DPI)

// <----------------------- ON LOAD EVENTS ----------------------->
// Need this onload to draw a black rectangle as a background color
// since setting in CSS doesn't save it in the PNG of canvas
 body.onload = () => {
    ctx.fillStyle = 'black'
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
}

// <----------------------- EVENT LISTENERS ----------------------->
window.addEventListener('mousedown', e => {
    let [x, y] = [e.clientX-width_offset, e.clientY-height_offset]
    mouse_down = true
    prev_x = x
    prev_y = y
})

window.addEventListener('mouseup', () => {
    mouse_down = false
})

window.addEventListener('resize', () => {
    width_offset = (window.innerWidth / 2) - (width / 2)
    height_offset = ((window.innerHeight / 2) - (btn_container_height / 2)) - (height / 2)
})

canvas.addEventListener('mousemove', e => {
    let [cur_x, cur_y] = [e.clientX-width_offset, e.clientY-height_offset]
    if (mouse_down) {
        ctx.beginPath()
        ctx.lineWidth = 20
        ctx.strokeStyle = 'white'
        ctx.moveTo(prev_x, prev_y)
        ctx.lineTo(cur_x, cur_y)
        ctx.stroke()   
        ctx.closePath()
        prev_x = cur_x
        prev_y = cur_y
    }
})

clear_btn.addEventListener('click', () => {
    ctx.fillStyle = 'black'
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
    label_span.textContent = ''
})

predict_btn.addEventListener('click', async () => {
    // Save the canvas as a blob then encode the blob into a base64 encoded string
    let reader = new FileReader()
    canvas.toBlob(blob => {
        // When reader is done reading, then we can proceed
        reader.onload = async () => {
            // We need to split since the part before the ',' is the Data-URL declaration
            // which isn't part of the Base64-encoded string
            // See the docs for more info (https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL)
            let img_data = reader.result.split(',')[1]
            
            // Send the data over to the server as a JSON
            let data = JSON.stringify({image : img_data})
            let URL = 'http://localhost:3000/predict'
            let params = {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : data
            }

            // Fetch returns a promise and so .json(), therefore, we must await both
            // https://dmitripavlutin.com/javascript-fetch-async-await/
            const response = await fetch(URL, params)
            const value = await response.json()
            label_span.textContent = value.label
        }
        
        // Read from the blob
        reader.readAsDataURL(blob)
    })
})
