width = 700
height = 400

canvas = document.createElement 'canvas'
canvas.width = width
canvas.height = height

document.body.appendChild canvas

context = canvas.getContext '2d'

context.fillStyle = "blue"
context.fillRect(0, 0, width, height)

ITERATION_MAX = 255

compute = (px, py) ->
  x0 = px / width - 2.5 # scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
  y0 = py / height - 1 # scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))
  x = 0.0
  y = 0.0
  iteration = 0
  max_iteration = 1000
  while (x*x + y*y < 4  and  iteration < ITERATION_MAX)
    xtemp = x*x - y*y + x0
    y = 2*x*y + y0
    x = xtemp
    iteration = iteration + 1

  plot(px, py, iteration)

plot = (x, y, n) ->
  context.fillStyle = "rgb(#{n}, #{n/2}, #{n/2})"
  context.fillRect(x, y, 1, 1)
