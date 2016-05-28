width = 700
height = 400

viewport =
  x: -0.775
  y: -0.1
  width: 0.05
  height: 0.02

#viewport =
  #x: -2.5
  #y: -1
  #width: 3.5
  #height: 2

pre = document.createElement 'pre'

canvas = document.createElement 'canvas'
canvas.width = width
canvas.height = height

document.body.appendChild canvas
document.body.appendChild pre

context = canvas.getContext '2d'

context.fillStyle = "white"
context.fillRect(0, 0, width, height)

ITERATION_MAX = 512

# scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
# scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))
pixelToWorld = (px, py, viewport) ->
  x: (px / width) * viewport.width + viewport.x
  y: ((height - py) / height) * viewport.height + viewport.y

compute = (px, py, viewport) ->
  {x:x0, y:y0} = pixelToWorld(px, py, viewport)
  x = 0.0
  y = 0.0
  iteration = 0
  while (x*x + y*y < 4 and iteration < ITERATION_MAX)
    xtemp = x*x - y*y + x0
    y = 2*x*y + y0
    x = xtemp
    iteration = iteration + 1

  return iteration

plot = (x, y, n) ->
  ni = ITERATION_MAX - n
  r = (ni) % 256
  g = 0 #(n % 256)
  b = (ni * 256 / ITERATION_MAX) | 0
  context.fillStyle = "rgb(#{r}, #{g}, #{b})"
  context.fillRect(x, y, 1, 1)

render = ->
  [0...height].forEach (py) ->
    [0...width].forEach (px) ->
      n = compute(px, py, viewport)
      plot(px, py, n)

canvas.onmousedown = (e) ->
  {offsetX:px, offsetY:py} = e
  
  p = pixelToWorld(px, py, viewport)
  centerViewport(p, viewport)
  render()

canvas.onmousemove = (e) ->
  {offsetX:px, offsetY:py} = e
  
  p = pixelToWorld(px, py, viewport)

  pre.textContent = """
    x: #{p.x.toFixed(8)}
    y: #{p.y.toFixed(8)}
  """

centerViewport = (p, viewport) ->
  viewport.x = p.x - viewport.width/2
  viewport.y = p.y - viewport.height/2

render()