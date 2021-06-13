
// <----------------------- CONSTANTS ----------------------->
const canvas = document.getElementById('canvas'),
    clear_btn = document.getElementById('clear-btn'),
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

ctx.canvas.width = width * DPI
ctx.canvas.height = height * DPI    
canvas.style.width = width + 'px'
canvas.style.height = height + 'px'
ctx.scale(DPI, DPI)

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
    console.log(cur_x, cur_y, prev_x, prev_y)
    if (mouse_down) {
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.moveTo(prev_x, prev_y)
        ctx.lineTo(cur_x, cur_y)
        ctx.stroke()   
        ctx.closePath()
        prev_x = cur_x
        prev_y = cur_y
    }
})

clear_btn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})