const canvas = document.getElementById('canvas')
const btn = document.getElementById('btn')

const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight

let mouse_down = false
let prev_x = -1
let prev_y = -1

canvas.addEventListener('mousedown', (e) => {
    let [x, y] = [e.clientX, e.clientY]
    mouse_down = true
    prev_x = x
    prev_y = y
})

canvas.addEventListener('mouseup', () => {
    mouse_down = false
})

canvas.addEventListener('mousemove', (e) => {
    let [cur_x, cur_y] = [e.clientX, e.clientY]
    if (mouse_down) {
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.moveTo(prev_x, prev_y)
        ctx.lineTo(cur_x, cur_y)
        ctx.stroke()   
        ctx.closePath()
        prev_x = cur_x
        prev_y = cur_y
    }
})