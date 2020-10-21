const handleComponentException = (e) => {
  console.error(e)
}

// Uses WebGL: https://www.tutorialspoint.com/webgl/webgl_sample_application.htm
// Draws the Logo in WebGL animation

let coefficient = 0.1 // Speed of increased size and effect initially
const targetCoefficient = 0.005 // target activity of pixel randomization
const numLines = 100000
let randomTargetXArr = []
let randomTargetYArr = []
const target = []

let vertices
let gl

// 1.) Loads the image, draws it to canvas and uses the drawn data to fill target array with logo-pixels
// Then calls loadScene()
const init = (imageCanvas, glCanvas, imageSrc) => {
  // const imageCanvas = image.current
  const ctx = imageCanvas.getContext('2d')

  const image = new Image()
  image.src = imageSrc


  image.onload = () => {
    const size = image.width
    imageCanvas.width = size
    imageCanvas.height = size

    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, size, size)

    const { data } = imageData

    // ImageData 4096 sized Uint8ClampedArray => RGBA which is ARGB (word-order) encoded (A => Alpha channel, encoding the opacity)
    // We only take the alpha channel, as we only need the opacity (ii += 4) & ignore all but zero opacity (black/white encoded logo)
    // We push the pixel positions into our target array
    for (let ii = 0; ii < data.length; ii += 4) {
      if (data[ii] === 0) {
        const pixNumber = ii / 4
        const xPos = pixNumber % size
        const yPos = parseInt(pixNumber / size, 10)
        const pos = { x: xPos / size - 0.5, y: -yPos / size + 0.5 }
        target.push(pos)
      }
    }

    initGL(glCanvas)
  }
}

// 2.) Initialises WebGL and creates the 3D scene.
const initGL = (glCanvas) => {
  // const glCanvas = canvas.current
  gl = glCanvas.getContext('experimental-webgl')

  if (!gl) {
    handleComponentException("There's no WebGL context available.", 'Logo Animation')
    return
  }

  gl.viewport(0, 0, glCanvas.width, glCanvas.height)

  createAndCompileShaders()

  associateShadersToBuffers()

  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  gl.clearColor(0.0, 0.0, 0.0, 0.0) // 4th argument sets opacity of background (0.0-1.0)
  gl.clearDepth(1.0)

  gl.enable(gl.BLEND)
  gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

  randomizePixels()

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const { perspectiveMatrix, modelViewMatrix } = getViewAndPerspective(glCanvas)

  // Define VertexAttributePointer with index,size,type, normalized, stride and *pointer
  const vertexPosAttribLocation = gl.getAttribLocation(gl.program, 'vertexPosition')
  gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0)

  const uModelViewMatrix = gl.getUniformLocation(gl.program, 'modelViewMatrix')
  const uPerspectiveMatrix = gl.getUniformLocation(gl.program, 'perspectiveMatrix')
  gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix))
  gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix))

  animate()
}

// 3.) Creates Vertex and Fragment shader, attaches them, links them and uses the shaderProgram
const createAndCompileShaders = () => {
  const vertexShaderScript =
    'attribute vec3 vertexPosition;' +
    'uniform mat4 modelViewMatrix;' +
    'uniform mat4 perspectiveMatrix;' +
    'void main(void) {' +
    'gl_Position = perspectiveMatrix * modelViewMatrix * vec4(  vertexPosition, 1.0);' +
    '}'

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vertexShaderScript)
  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    gl.deleteShader(vertexShader)
    handleComponentException("Couldn't compile the vertex shader", 'Logo Animation')
    return
  }

  const fragmentShaderScript =
    'precision highp float;' +
    'void main(void) {' +
    'gl_FragColor = vec4(0.0, 0.1, 0.2, 1.0);' + // vec4(0.2, 0.3, 0.4, 1.0)
    '}'

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragmentShaderScript)
  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    gl.deleteShader(fragmentShader)
    handleComponentException("Couldn't compile the fragment shader", 'Logo Animation')
    return
  }

  gl.program = gl.createProgram()
  gl.attachShader(gl.program, vertexShader)
  gl.attachShader(gl.program, fragmentShader)
  gl.linkProgram(gl.program)
  if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
    gl.deleteProgram(gl.program)
    gl.deleteProgram(vertexShader)
    gl.deleteProgram(fragmentShader)
    handleComponentException('Unable to initialise shaders', 'Logo Animation')
    return
  }
  gl.useProgram(gl.program)
}

// 4.) Associates the created shader programs to buffer objects
const associateShadersToBuffers = () => {
  const vertexPosition = gl.getAttribLocation(gl.program, 'vertexPosition')
  gl.enableVertexAttribArray(vertexPosition)
}

// 5.) Generate the vertices buffer and randomX,randomY buffers from target array
const randomizePixels = () => {
  coefficient = 0.1
  randomTargetXArr = []
  randomTargetYArr = []
  vertices = []

  // -------------------------------

  for (let ii = 0; ii < numLines; ii += 1) {
    const randomPos = target[parseInt(target.length * Math.random(), 10)]
    randomTargetXArr.push(randomPos.x)
    randomTargetYArr.push(randomPos.y)

    vertices.push(randomPos.x, randomPos.y, 1.83)
    vertices.push(randomPos.x, randomPos.y, 1.83)
    vertices.push(randomPos.x, randomPos.y, 1.83)
    vertices.push(randomPos.x, randomPos.y, 1.83)
    vertices.push(randomPos.x, randomPos.y, 1.83)
    vertices.push(randomPos.x, randomPos.y, 1.83)
  }

  vertices = new Float32Array(vertices)
  randomTargetXArr = new Float32Array(randomTargetXArr)
  randomTargetYArr = new Float32Array(randomTargetYArr)
}

// 6.) Construct the view and perspective matrices
const getViewAndPerspective = (glCanvas) => {
  const fieldOfView = 25.0
  const aspectRatio = glCanvas.width / glCanvas.height
  const nearPlane = 1.0
  const farPlane = 10000.0
  const top = nearPlane * Math.tan((fieldOfView * Math.PI) / 360.0)
  const bottom = -top
  const right = top * aspectRatio
  const left = -right

  const a = (right + left) / (right - left)
  const b = (top + bottom) / (top - bottom)
  const c = (farPlane + nearPlane) / (farPlane - nearPlane)
  const d = (2 * farPlane * nearPlane) / (farPlane - nearPlane)
  const x = (2 * nearPlane) / (right - left)
  const y = (2 * nearPlane) / (top - bottom)
  const perspectiveMatrix = [x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0]

  const modelViewMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  return { perspectiveMatrix, modelViewMatrix }
}

// 7.) Set eventhandlers and draw the scene
const animate = () => {
  requestAnimationFrame(animate)
  drawScene()
}

// 8.) Loop: Draw scene on each animation
const drawScene = () => {
  updateVertices()

  gl.lineWidth(1)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)

  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.drawArrays(gl.LINES, 0, numLines)

  gl.flush()
}

// 9.) Loop: Update vertices in new time frame (based on random buffers)
const updateVertices = () => {
  // cn += .1;

  let i
  let bp // n = vertices.length, p;
  let px
  let py
  // var pTheta;
  // var rad;
  let num

  coefficient += (targetCoefficient - coefficient) * 0.1

  for (i = 0; i < numLines * 2; i += 2) {
    // count += .3;
    bp = i * 3
    // copy old positions

    vertices[bp] = vertices[bp + 3]
    vertices[bp + 1] = vertices[bp + 4]

    num = parseInt(i / 2, 10)
    // pTheta = thetaArr[num];

    // rad = velRadArr[num];// + Math.cos(pTheta + i * freqArr[i]) *  boldRateArr[num];

    // pTheta = pTheta + velThetaArr[num];
    // thetaArr[num] = pTheta;
    // var pos = target[parseInt(target.length * Math.random())];
    const targetPosX = randomTargetXArr[num]
    const targetPosY = randomTargetYArr[num]
    // va
    px = vertices[bp + 3]
    px += (targetPosX - px) * coefficient + (Math.random() - 0.5) * coefficient
    vertices[bp + 3] = px

    py = vertices[bp + 4]
    py += (targetPosY - py) * coefficient + (Math.random() - 0.5) * coefficient
    vertices[bp + 4] = py
  }
}

export { randomizePixels }
export default init
