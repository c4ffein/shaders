// CC BY-SA 4.0 - Copyright (c) 2021 Rabbid76
// - https://stackoverflow.com/help/licensing
// - https://stackoverflow.com/a/69829185
// - https://stackoverflow.com/users/5577765/rabbid76
// - https://creativecommons.org/licenses/by-sa/4.0/
// CC BY-SA 4.0 - Copyright (c) 2025 c4ffein
// - refactored to be imported as a js module
// - refactored to allow teardown
// - switch to webgl2
// - various improvements


export function initScene(canvas, drawShaderVs, drawShaderFs) {
  const gl = canvas.getContext('webgl2');
  if (!gl)
    return;
  const mousepos = [0, 0];
  const progDraw = gl.createProgram();  // TODO something when unregistering?
  console.log(progDraw);
  for (let i = 0; i < 2; ++i) {
    const source = i==0 ? drawShaderVs : drawShaderFs;
    const shaderObj = gl.createShader(i==0 ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    gl.shaderSource(shaderObj, source);
    gl.compileShader(shaderObj);
    let status = gl.getShaderParameter(shaderObj, gl.COMPILE_STATUS);
    if (!status) alert(gl.getShaderInfoLog(shaderObj));
    gl.attachShader(progDraw, shaderObj);
  }
  gl.linkProgram(progDraw);
  status = gl.getProgramParameter(progDraw, gl.LINK_STATUS);
  if (!status) alert(gl.getProgramInfoLog(progDraw));
  progDraw.inPos = gl.getAttribLocation(progDraw, 'inPos');
  progDraw.iTime = gl.getUniformLocation(progDraw, 'iTime');
  progDraw.iMouse = gl.getUniformLocation(progDraw, 'iMouse');
  progDraw.iResolution = gl.getUniformLocation(progDraw, 'iResolution');
  gl.useProgram(progDraw);

  const pos = [ -1, -1, 1, -1, 1, 1, -1, 1 ];
  const inx = [ 0, 1, 2, 0, 2, 3 ];
  const bufObj = {};
  bufObj.pos = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufObj.pos);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  bufObj.inx = gl.createBuffer();
  bufObj.inx.len = inx.length;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufObj.inx);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inx), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(progDraw.inPos);
  gl.vertexAttribPointer(progDraw.inPos, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Event listeners, and start the render loop
  const mousemoveListener = (e) => { [mousepos[0], mousepos[1]] = [e.clientX, e.clientY]; }
  canvas.addEventListener('mousemove', mousemoveListener);
  const resizeListener = () => {  //  TODO or this? vp_size = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    const vp_size = [window.innerWidth, window.innerHeight]; canvas.width = vp_size[0]; canvas.height = vp_size[1];
  }
  window.addEventListener('resize', resizeListener);
  resizeListener();
  let stopRendering = false;
  requestAnimationFrame((deltaMS) => render(stopRendering, canvas, gl, progDraw, bufObj, mousepos, deltaMS));

  const render = (deltaMS) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1f(progDraw.iTime, deltaMS/1000.0);
    gl.uniform2f(progDraw.iResolution, canvas.width, canvas.height);
    gl.uniform2f(progDraw.iMouse, mousepos[0], mousepos[1]);
    gl.drawElements(gl.TRIANGLES, bufObj.inx.len, gl.UNSIGNED_SHORT, 0);

    if(!stopRendering){ requestAnimationFrame((deltaMS) => render(deltaMS)); }
  }

  return () => {
    canvas.removeEventListener('mousemove', mousemoveListener);
    window.removeEventListener('resize', resizeListener);
    stopRendering = true;
  }
}
