import shaderCode from "../shaders/shader.wgsl?raw";
import depthShaderCode from "../shaders/depthShader.wgsl?raw";
import displayShaderCode from "../shaders/displayShader.wgsl?raw";
import finalShaderCode from "../shaders/finalShader.wgsl?raw";
import { loadMesh } from "/src/js/loadMesh.js";
import faceObj from "/src/data/face.obj?raw";
import { loadImage } from "./loadImage";


// Minimal 4x4 Matrix implementaton, to be used for the Model-View-Projection matrix
function mat4Identity() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

function mat4Translate(x, y, z) {
  const m = mat4Identity();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[0 * 4 + row] * b[col * 4 + 0] +
        a[1 * 4 + row] * b[col * 4 + 1] +
        a[2 * 4 + row] * b[col * 4 + 2] +
        a[3 * 4 + row] * b[col * 4 + 3];
    }
  }
  return out;
}

function mat4Transpose(a) {
  const out = new Float32Array(16);
  out[0]  = a[0];
  out[1]  = a[4];
  out[2]  = a[8];
  out[3]  = a[12];
  out[4]  = a[1];
  out[5]  = a[5];
  out[6]  = a[9];
  out[7]  = a[13];
  out[8]  = a[2];
  out[9]  = a[6];
  out[10] = a[10];
  out[11] = a[14];
  out[12] = a[3];
  out[13] = a[7];
  out[14] = a[11];
  out[15] = a[15];
  return out;
}

function mat4Invert(a) {
  const out = new Float32Array(16);

  const a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3];
  const a10 = a[4],  a11 = a[5],  a12 = a[6],  a13 = a[7];
  const a20 = a[8],  a21 = a[9],  a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  const b00 = a00 * a11 - a01 * a10;
  const b01 = a00 * a12 - a02 * a10;
  const b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11;
  const b04 = a01 * a13 - a03 * a11;
  const b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30;
  const b07 = a20 * a32 - a22 * a30;
  const b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31;
  const b10 = a21 * a33 - a23 * a31;
  const b11 = a22 * a33 - a23 * a32;

  // Determinant
  let det =
    b00 * b11 -
    b01 * b10 +
    b02 * b09 +
    b03 * b08 -
    b04 * b07 +
    b05 * b06;

  if (!det) return null;
  det = 1.0 / det;

  out[0]  = ( a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1]  = (-a01 * b11 + a02 * b10 - a03 * b09) * det;
  out[2]  = ( a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3]  = (-a21 * b05 + a22 * b04 - a23 * b03) * det;

  out[4]  = (-a10 * b11 + a12 * b08 - a13 * b07) * det;
  out[5]  = ( a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6]  = (-a30 * b05 + a32 * b02 - a33 * b01) * det;
  out[7]  = ( a20 * b05 - a22 * b02 + a23 * b01) * det;

  out[8]  = ( a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9]  = (-a00 * b10 + a01 * b08 - a03 * b06) * det;
  out[10] = ( a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * det;

  out[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * det;
  out[13] = ( a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * det;
  out[15] = ( a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

function mat4Perspective(fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy * 0.5);
  const nf = 1.0 / (near - far);

  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, far * nf, -1,
    0, 0, (near * far) * nf, 0,
  ]);
}

//-----------------------------------------------------------------------
// Camera
//-----------------------------------------------------------------------

function getCameraPosition(camera) {
  return [
    camera.target[0] + camera.radius * Math.cos(camera.pitch) * Math.sin(camera.yaw),
    camera.target[1] + camera.offsetY + camera.radius * Math.sin(camera.pitch),
    camera.target[2] + camera.radius * Math.cos(camera.pitch) * Math.cos(camera.yaw)
  ];
}

function pan(camera, dx, dy) {
  const cosYaw = Math.cos(camera.yaw);
  const sinYaw = Math.sin(camera.yaw);

  // right vector
  const rightX = cosYaw;
  const rightZ = -sinYaw;

  // up vector (world up)
  const upX = 0;
  const upY = 1;
  const upZ = 0;

  const scale = camera.radius * camera.panSpeed;

  camera.target[0] -= (rightX * dx - upX * dy) * scale;
  camera.target[1] -= dy * scale;
  camera.target[2] -= (rightZ * dx - upZ * dy) * scale;
}

function lookAt(out, eye, target, up) {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];

  let len = Math.hypot(zx, zy, zz);
  zx /= len; zy /= len; zz /= len;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;

  len = Math.hypot(xx, xy, xz);
  xx /= len; xy /= len; xz /= len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
  out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
  out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  out[15] = 1;
}

function updateCamera(camera) {
  const eye = getCameraPosition(camera);
  lookAt(camera.viewMat, eye, camera.target, camera.up);
}

function createCamera(aspect) {
  const camera = {};
  camera.modelMat = mat4Identity(0, 0, 0);
  camera.viewMat  = mat4Identity(); 
  // Intrinsic parameters
  camera.fov = Math.PI / 4.0; // in radian
  camera.aspect = aspect;
  camera.near = 0.01;
  camera.far  = 10.0;
  camera.projMat  = mat4Perspective(
    camera.fov,
    camera.aspect,
    camera.near,
    camera.far
  );
  camera.yaw = 0; // In radian
  camera.pitch = 0;
  camera.radius = 1.0;

  camera.offsetY = -0.3;
  
  camera.target = [0.0, 0.0, 0.0];
  camera.up = [0, 1, 0];
  camera.rotateSpeed = 0.005;
  camera.zoomSpeed = 0.001;
  camera.panSpeed = 0.002;
  
  camera.minRadius = 1;
  camera.maxRadius = 10000;

  camera.dragging = false;
  camera.panning = false;
  camera.lastX = 0;
  camera.lastY = 0;
  return camera;
}



//-----------------------------------------------------------------------
// Scene
//-----------------------------------------------------------------------

async function createScene(camAspect) {
  const scene = {};
  const s = 0.5;
  scene.camera =  createCamera(camAspect);
  scene.camera.target = [0.0, 0.3, 0.0];
  scene.camera.radius = 4.0*s;
  
  // Lighting Env.
  const tgt = [0.0, s, 0.0];
  const ang = 0.3;
  var rotatingLight = { position: [1.8*s, 1.8*s, 1.8*s], intensity: 0.5, color: [1.0, 1.0, 1.0], spot: tgt, angle: ang, useRaytracedShadows: false};
  var keyLight = { position: [-0.75*s, 1.5*s, 1.5*s], intensity: 1.5, color: [1.0, 1.0, 1.0], spot: tgt, angle: ang, useRaytracedShadows: false};
  var fillLight = { position: [0.75*s, 0.5*s, 1.5*s], intensity: 2.5, color: [0.0, 0.2, 0.8], spot: tgt, angle: ang, useRaytracedShadows: false};
  var backLight = { position: [-0.75*s, 0.5*s, -0.75*s], intensity: 0.8, color: [0.7, 0.3, 0.0], spot: tgt, angle: ang, useRaytracedShadows: false};
  scene.lightSources = [keyLight, fillLight, backLight, rotatingLight];
  
  // Materials
  var mainMat = { albedo: [0.553, 0.333, 0.141] };
  scene.materials = [mainMat];
  
  // Meshes
  const mainMesh = loadMesh(faceObj);
  scene.texture = await loadImage("/data/face_texture.png");
  document.getElementById("loading").style.display = "none";
  document.getElementById("controls").style.display = "block";
  mainMesh.materialIndex = 0;
  // scene.meshes = [mainMesh, mainMesh, mainMesh];
  scene.meshes = [mainMesh];
  scene.time = 0;
  return scene;
}

async function createGPUApp() {
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported on this browser.");
  }
  const GPUApp = {
    // Components used for setting up the graphics environment
    listCanvases:[],
    canvas: {},
    lilcanvas: {},
    matteCanvas: {},
    diffuseCanvas: {},
    depthCanvas: {},
    // Implementation of WebGPU
    adapter: {},
    // GPU interface to create objects on the GPU
    device: {},
    // Configures WebGPU
    context: {},
    lilcontext: {},
    diffuseContext: {},
    matteContext: {},
    depthContext: {},
    specularContext: {},
    
    canvasFormat: {},
    // GPU memory story the mesh data
    meshBuffers:{},
    // GPU memory used to pass parameters from CPU to GPU, such as the camera or light properties
    uniformBuffer: {},
    // Handle on GPU parameters
    bindGroup: {},
    bindGroupDepth: {},
    bindGroupMatte: {},
    bindGroupDiffuse: {},
    bindGroupDepthDisplay: {},
    final_bindGroup: {},
    // Handle on the GPU shaders
    shaderModule: {},
    depthShaderModule: {},
    displayShaderModule: {},
    finalShaderModule: {},
    // Organization of the input of the pipeline/vertex shader
    vertexBuffersLayout: {},
    // Organization of the 
    bindGroupLayout: {},
    bindGroupLayoutDepth: {},
    bindGroupLayoutDisplay: {},
    final_bindGroupLayout: {},
    // Rasterization pipeline
    rasterizationPipeline: {},
    // Depth pipeline
    depthPipeline: {},
    displayPipeline: {},
    final_Pipeline: {},
    // Depth map used to store per-pixel depth (Z-Buffer)
    depthTexture: {},
    depthTextureFinal: {},
    matteTexture: {},
    // finalTexture: {},
    // aligned buffer for Camera, light and material uniforms
    uniformData : new Float32Array(88),
  };
  GPUApp.canvas = document.querySelector("#bigFinalCanvas");
  GPUApp.lilcanvas = document.querySelector("#lilFinalCanvas");
  // GPUApp.canvas = document.querySelector("#lilFinalCanvas");
  GPUApp.diffuseCanvas = document.querySelector("#diffuseCanvas");
  GPUApp.matteCanvas = document.querySelector("#matteCanvas");
  GPUApp.depthCanvas = document.querySelector("#depthCanvas");
  GPUApp.specularCanvas = document.querySelector("#specularCanvas");

  GPUApp.listCanvases.push(GPUApp.canvas, GPUApp.lilcanvas, GPUApp.diffuseCanvas, GPUApp.matteCanvas, GPUApp.depthCanvas, GPUApp.specularCanvas);

  GPUApp.adapter = await navigator.gpu.requestAdapter();
  if (!GPUApp.adapter) {
    throw new Error("No appropriate GPUAdapter found.");
  }
  GPUApp.device = await GPUApp.adapter.requestDevice();
  GPUApp.context = GPUApp.canvas.getContext("webgpu");
  GPUApp.canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  GPUApp.context.configure({
    device: GPUApp.device,
    format: GPUApp.canvasFormat,
    alphaMode: "opaque",
  });
  GPUApp.lilcontext = GPUApp.lilcanvas.getContext("webgpu");
  GPUApp.lilcontext.configure({
    device: GPUApp.device,
    format: GPUApp.canvasFormat,
    alphaMode: "opaque",
  });
  GPUApp.diffuseContext = GPUApp.diffuseCanvas.getContext("webgpu");
  GPUApp.diffuseContext.configure({
    device: GPUApp.device,
    format: GPUApp.canvasFormat,
    alphaMode: "opaque",
  });
  GPUApp.matteContext = GPUApp.matteCanvas.getContext("webgpu");
  GPUApp.matteContext.configure({
    device: GPUApp.device,
    format: GPUApp.canvasFormat,
    alphaMode: "opaque",
  });
  GPUApp.depthContext = GPUApp.depthCanvas.getContext("webgpu");
  GPUApp.depthContext.configure({
    device: GPUApp.device,
    format: GPUApp.canvasFormat,
    alphaMode: "opaque",
  });
  GPUApp.specularContext = GPUApp.specularCanvas.getContext("webgpu");
  GPUApp.specularContext.configure({
    device: GPUApp.device,
    format: GPUApp.canvasFormat,
    alphaMode: "opaque",
  });
  return GPUApp;
}

function createGPUBuffer(device, data, usage) {
  const buffer = device.createBuffer({
    size: (data.byteLength + 3) & ~3, // 4-byte aligned
    usage
  });
  device.queue.writeBuffer(buffer, 0, data);

  return buffer;
}

function createMeshBuffers(GPUApp, meshes) {
  var positionsTotalLength = 0;
  var normalsTotalLength = 0; 
  var uvsTotalLength = 0;
  var indicesTotalLength = 0;
  for (var i = 0; i < meshes.length; ++i) {
    var m = meshes[i];
    positionsTotalLength += m.positions.length;
    normalsTotalLength += m.normals.length;
    uvsTotalLength += m.uvs.length;
    indicesTotalLength += m.indices.length;
  }
  var P = new Float32Array(positionsTotalLength);
  var N = new Float32Array(normalsTotalLength);
  var I = new Uint32Array(indicesTotalLength);
  var U = new Float32Array(uvsTotalLength);
  var M = new Uint32Array(4*meshes.length);
  var positionsOffset = 0;
  var normalsOffset = 0;
  var indicesOffset = 0;
  var uvsOffset = 0;
  for (var i = 0; i < meshes.length; i++) {
    var m = meshes[i];
    var meshOffset = 4*i;
    P.set (m.positions, positionsOffset);
    M[meshOffset] = positionsOffset/3;
    positionsOffset += m.positions.length;
    N.set (m.normals, normalsOffset);
    normalsOffset += m.normals.length;
    I.set (m.indices, indicesOffset);
    U.set(m.uvs, uvsOffset);
    uvsOffset += m.uvs.length;
    M[meshOffset+1] = indicesOffset/3;
    M[meshOffset+2] = m.indices.length/3;
    indicesOffset += m.indices.length;
    M[meshOffset+3] = m.materialIndex;
  }
  return {
    positionBuffer: createGPUBuffer(
      GPUApp.device,
      P,
      GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ),
    
    normalBuffer: createGPUBuffer(
      GPUApp.device,
      N,
      GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ),
    
    indexBuffer: createGPUBuffer(
      GPUApp.device,
      I,
      GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ),
    uvBuffer: createGPUBuffer(
      GPUApp.device,
      U,
      GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ),
    meshBuffer: createGPUBuffer(
      GPUApp.device,
      M,
      GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ),
    
    indexFormat: "uint32"
  };
}

function fillMaterialStagingBuffer(GPUApp, materials) {
  var numOfMaterials = materials.length;
  var sizeOfMaterial = 4; // in Float32, accounting for padding
  for (var i = 0; i < numOfMaterials; i++) {
    var m = materials[i];
    var offset = i * sizeOfMaterial;
    GPUApp.materialStagingBuffer.set(m.albedo, offset);
    GPUApp.materialStagingBuffer[offset+3] = 0.0; // padding
  }
}

function createMaterialBuffer(GPUApp, materials) {
  var numOfMaterials = materials.length;
  var sizeOfMaterial = 4; // in Float32, accounting for padding
  GPUApp.materialStagingBuffer = new Float32Array(numOfMaterials*sizeOfMaterial);
  fillMaterialStagingBuffer(GPUApp, materials);
  return createGPUBuffer(
      GPUApp.device,
      GPUApp.materialStagingBuffer,
      GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  );
}

function updateMaterialBuffer(GPUApp, materials) {
  fillMaterialStagingBuffer(GPUApp, materials);
  GPUApp.device.queue.writeBuffer(GPUApp.materialBuffer, 0, GPUApp.materialStagingBuffer);
}

function fillLightSourceStagingBuffer(GPUApp, lightSources) {
  var numOfLightSources = lightSources.length;
  var sizeOfLigthSource = 12; // in Float32, accounting for padding
  for (var i = 0; i < numOfLightSources; i++) {
    var l = lightSources[i];
    var offset = i * sizeOfLigthSource;
    GPUApp.lightSourceStagingBuffer.set(l.position, offset);
    GPUApp.lightSourceStagingBuffer[offset+3] = l.intensity;
    GPUApp.lightSourceStagingBuffer.set(l.color, offset+4);
    GPUApp.lightSourceStagingBuffer[offset+7] = l.angle; 
    GPUApp.lightSourceStagingBuffer.set(l.spot, offset+8); 
    GPUApp.lightSourceStagingBuffer[offset+11] = 0; 
  }
}

function createLightSourceBuffer(GPUApp, lightSources) {
  var numOfLightSources = lightSources.length;
  var sizeOfLigthSource = 12; // in Float32, accounting for padding
  GPUApp.lightSourceStagingBuffer = new Float32Array(numOfLightSources*sizeOfLigthSource);
  fillLightSourceStagingBuffer(GPUApp, lightSources);
  return createGPUBuffer(
      GPUApp.device,
      GPUApp.lightSourceStagingBuffer,
      GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  );
}

function updateLightSourceBuffer(GPUApp, lightSources) {
  fillLightSourceStagingBuffer(GPUApp, lightSources);
  GPUApp.device.queue.writeBuffer(GPUApp.lightSourceBuffer, 0, GPUApp.lightSourceStagingBuffer);
}

// Create and fill the GPU buffers used to store the geometry to render
function initGPUBuffers(GPUApp, scene) {

  GPUApp.meshBuffers = createMeshBuffers(GPUApp, scene.meshes);
  GPUApp.materialBuffer = createMaterialBuffer(GPUApp, scene.materials);
  GPUApp.lightSourceBuffer = createLightSourceBuffer(GPUApp, scene.lightSources);
  GPUApp.uniformBuffer = createGPUBuffer(
    GPUApp.device, 
    GPUApp.uniformData, 
    GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  );
  
  GPUApp.textureGPU = GPUApp.device.createTexture({
    size: [scene.texture.width, scene.texture.height],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });
  
  GPUApp.depthTexture = GPUApp.device.createTexture({
    size: [GPUApp.canvas.width, GPUApp.canvas.height],
    format: "depth24plus",
    usage:
      GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });
  GPUApp.depthTextureFinal = GPUApp.device.createTexture({
    size: [GPUApp.canvas.width, GPUApp.canvas.height],
    format: GPUApp.canvasFormat,
    usage:
      GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  GPUApp.matteTexture = GPUApp.device.createTexture({
    size: [GPUApp.canvas.width, GPUApp.canvas.height],
    format: GPUApp.canvasFormat,
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
  });
  GPUApp.diffuseTexture = GPUApp.device.createTexture({
    size: [GPUApp.canvas.width, GPUApp.canvas.height],
    format: GPUApp.canvasFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
  });
  GPUApp.specularTexture = GPUApp.device.createTexture({
    size: [GPUApp.canvas.width, GPUApp.canvas.height],
    format: GPUApp.canvasFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
  });
  // GPUApp.finalTexture = GPUApp.device.createTexture({
  //   size: [GPUApp.canvas.width, GPUApp.canvas.height],
  //   format: GPUApp.canvasFormat,
  //   usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
  // });

  GPUApp.device.queue.copyExternalImageToTexture(
    { source: scene.texture },
    { texture: GPUApp.textureGPU },
    [scene.texture.width, scene.texture.height]
  );

  // sampler
  GPUApp.textureSampler = GPUApp.device.createSampler({
    addressModeU: 'repeat',
    addressModeV: 'repeat',
    magFilter: 'linear',
    minFilter: 'linear',
  });
  GPUApp.depthTextureSampler = GPUApp.device.createSampler({});

  GPUApp.bindGroup = GPUApp.device.createBindGroup({
    layout: GPUApp.bindGroupLayout,
    entries: [{
        binding: 0,
        resource: { buffer: GPUApp.uniformBuffer },
      },
      {
        binding: 1,
        resource: { buffer: GPUApp.meshBuffers.positionBuffer },
      },
      {
        binding: 2,
        resource: { buffer: GPUApp.meshBuffers.normalBuffer },
      },
      {
        binding: 3,
        resource: { buffer: GPUApp.meshBuffers.indexBuffer },
      },
      {
        binding: 4,
        resource: { buffer: GPUApp.meshBuffers.meshBuffer },
      },
      {
        binding: 5,
        resource: { buffer: GPUApp.materialBuffer },
      },
      {
        binding: 6,
        resource: { buffer: GPUApp.lightSourceBuffer },
      },
      {
        binding: 7,
        resource: GPUApp.textureGPU.createView(),
      },
      {
        binding: 8,
        resource: GPUApp.textureSampler,
      },
      {
        binding: 9,
        resource: { buffer: GPUApp.meshBuffers.uvBuffer },
      },
    ],
  });
  const matSampler = GPUApp.device.createSampler({ magFilter: 'nearest', minFilter: 'nearest' });

  GPUApp.bindGroupMatte = GPUApp.device.createBindGroup({
    layout: GPUApp.bindGroupLayoutDisplay,
    entries: [
      {
        binding: 0,
        resource: GPUApp.matteTexture.createView(),
      },
      {
        binding: 1,
        resource: matSampler,
      }
    ],
  });
  
  GPUApp.bindGroupDiffuse = GPUApp.device.createBindGroup({
    layout: GPUApp.bindGroupLayoutDisplay,
    entries: [
      {
        binding: 0,
        resource: GPUApp.diffuseTexture.createView(),
      },
      {
        binding: 1,
        resource: matSampler,
      }
    ],
  });
  GPUApp.bindGroupSpecular = GPUApp.device.createBindGroup({
    layout: GPUApp.bindGroupLayoutDisplay,
    entries: [
      {
        binding: 0,
        resource: GPUApp.specularTexture.createView(),
      },
      {
        binding: 1,
        resource: matSampler,
      }
    ],
  });
  GPUApp.bindGroupDepthDisplay = GPUApp.device.createBindGroup({
    layout: GPUApp.bindGroupLayoutDisplay,
    entries: [
      {
        binding: 0,
        resource: GPUApp.depthTextureFinal.createView(),
      },
      {
        binding: 1,
        resource: matSampler,
      }
    ],
  });

  const pointSampler = GPUApp.device.createSampler({ magFilter: 'nearest', minFilter: 'nearest', mipmapFilter: 'nearest' });
  const linearSampler = GPUApp.device.createSampler({ magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'nearest' });

  GPUApp.final_bindGroup = GPUApp.device.createBindGroup({
    layout: GPUApp.final_bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: GPUApp.diffuseTexture.createView(),
      },
      {
        binding: 1,
        resource: GPUApp.matteTexture.createView(),
      },
      {
        binding: 2,
        resource: GPUApp.depthTextureFinal.createView(),
      },
      {
        binding: 3,
        resource: GPUApp.specularTexture.createView(),
      },
      {
        binding: 4,
        resource: pointSampler,
      },
      {
        binding: 5,
        resource: linearSampler,
      }
    ],
  });

  GPUApp.bindGroupDepth = GPUApp.device.createBindGroup({
    layout: GPUApp.bindGroupLayoutDepth,
    entries: [{
        binding: 0,
        resource: { buffer: GPUApp.uniformBuffer },
      },
      {
        binding: 1,
        resource: { buffer: GPUApp.meshBuffers.positionBuffer },
      },
      {
        binding: 2,
        resource: { buffer: GPUApp.meshBuffers.normalBuffer },
      },
      {
        binding: 3,
        resource: { buffer: GPUApp.meshBuffers.indexBuffer },
      },
      {
        binding: 4,
        resource: { buffer: GPUApp.meshBuffers.meshBuffer },
      },
      {
        binding: 5,
        resource: { buffer: GPUApp.materialBuffer },
      },
      {
        binding: 6,
        resource: { buffer: GPUApp.lightSourceBuffer },
      },
      {
        binding: 7,
        resource: GPUApp.textureGPU.createView(),
      },
      {
        binding: 8,
        resource: GPUApp.textureSampler,
      },
      {
        binding: 9,
        resource: { buffer: GPUApp.meshBuffers.uvBuffer },
      },
      {
        binding: 10,
        resource: GPUApp.depthTexture.createView(),
      },
      {
        binding: 11,
        resource: GPUApp.depthTextureSampler,
      }
    ],
  });
  
}

function initRenderPipeline(GPUApp) {
  // const shaders = ;
  GPUApp.shaderModule = GPUApp.device.createShaderModule({
    label: "Shaders",
    code: shaderCode
  });
  GPUApp.depthShaderModule = GPUApp.device.createShaderModule({
    label: "depthShaders",
    code: depthShaderCode
  });
  GPUApp.displayShaderModule = GPUApp.device.createShaderModule({
    label: "displayShaders",
    code: displayShaderCode
  });
  GPUApp.finalShaderModule = GPUApp.device.createShaderModule({
    label: "finalShaders",
    code: finalShaderCode
  });

  GPUApp.bindGroupLayout = GPUApp.device.createBindGroupLayout({
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "uniform" },
    },
    {
      binding: 1,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 2,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 3,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 4,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 5,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 6,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 7,
      visibility: GPUShaderStage.FRAGMENT,
      texture: { sampleType: "float" },
    },
    {
      binding: 8,
      visibility: GPUShaderStage.FRAGMENT,
      sampler: { type: "filtering" },
    },
    {
      binding: 9,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
  ],
  });  
  
  GPUApp.bindGroupLayoutDepth = GPUApp.device.createBindGroupLayout({
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "uniform" },
    },
    {
      binding: 1,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 2,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 3,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 4,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 5,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 6,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 7,
      visibility: GPUShaderStage.FRAGMENT,
      texture: { sampleType: "float" },
    },
    {
      binding: 8,
      visibility: GPUShaderStage.FRAGMENT,
      sampler: { type: "filtering" },
    },
    {
      binding: 9,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage" },
    },
    {
      binding: 10,
      visibility: GPUShaderStage.FRAGMENT,
      texture: { sampleType: "depth" },
    },
    {
      binding: 11,
      visibility: GPUShaderStage.FRAGMENT,
      sampler: { type: "non-filtering" },
    }
  ],
  });  

  
  GPUApp.bindGroupLayoutDisplay = GPUApp.device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { sampleType: "float" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: { type: "filtering" },
      },
    ],
  });  
  GPUApp.final_bindGroupLayout = GPUApp.device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { sampleType: "float" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { sampleType: "float" },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { sampleType: "float" },
      },
      {
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { sampleType: "float" },
      },
      {
        binding: 4,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: { type: "filtering" },
      },
      {
        binding: 5,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: { type: "filtering" },
      },
    ],
  });  



  GPUApp.rasterizationPipeline = GPUApp.device.createRenderPipeline({
      label: "rasterizationPipeline",
      //layout: "auto",
      layout: GPUApp.device.createPipelineLayout({
        bindGroupLayouts: [GPUApp.bindGroupLayout],
      }),
      vertex: {
        module: GPUApp.shaderModule,
        entryPoint: "rasterVertexMain",
      },
      fragment: {
        module: GPUApp.shaderModule,
        entryPoint: "rasterFragmentMain",
        targets: [
          {
            format: GPUApp.canvasFormat // diffuse
          },
          {
            format: GPUApp.canvasFormat // matte
          },
          {
            format: GPUApp.canvasFormat // specular
          }
        ]
      },
      primitive: {
        topology: "triangle-list", // use "line-list" for sanity check
        cullMode: "back", // activate backface culling
      },
      depthStencil: {
        format: "depth24plus",   // Must match depth texture
        depthWriteEnabled: true,
        depthCompare: "less",    // Standard depth (Z) test
    },
  });
  
  GPUApp.depthPipeline = GPUApp.device.createRenderPipeline({
      label: "depthPipeline",
      //layout: "auto",
      layout: GPUApp.device.createPipelineLayout({
        bindGroupLayouts: [GPUApp.bindGroupLayoutDepth],
      }),
      vertex: {
        module: GPUApp.depthShaderModule,
        entryPoint: "rasterVertexMain",
      },
      fragment: {
        module: GPUApp.depthShaderModule,
        entryPoint: "rasterFragmentMain",
        targets: [{
          format: GPUApp.canvasFormat
        }]
      },
      primitive: {
        topology: "triangle-list", // use "line-list" for sanity check
        cullMode: "back", // activate backface culling
      },
  });

  
  GPUApp.displayPipeline = GPUApp.device.createRenderPipeline({
      label: "displayPipeline",
      //layout: "auto",
      layout: GPUApp.device.createPipelineLayout({
        bindGroupLayouts: [GPUApp.bindGroupLayoutDisplay],
      }),
      vertex: {
        module: GPUApp.displayShaderModule,
        entryPoint: "displayVertexMain",
      },
      fragment: {
        module: GPUApp.displayShaderModule,
        entryPoint: "displayFragmentMain",
        targets: [
          {
            format: GPUApp.canvasFormat // color
          }
        ]
      },
      primitive: {
        topology: "triangle-list", // use "line-list" for sanity check
        cullMode: "back", // activate backface culling
      },
  });
  GPUApp.final_Pipeline = GPUApp.device.createRenderPipeline({
      label: "Final Pipeline",
      //layout: "auto",
      layout: GPUApp.device.createPipelineLayout({
        bindGroupLayouts: [GPUApp.final_bindGroupLayout],
      }),
      vertex: {
        module: GPUApp.finalShaderModule,
        entryPoint: "finalVertexMain",
      },
      fragment: {
        module: GPUApp.finalShaderModule,
        entryPoint: "finalFragmentMain",
        targets: [
          {
            format: GPUApp.canvasFormat // color
          }
        ]
      },
      primitive: {
        topology: "triangle-list", // use "line-list" for sanity check
        cullMode: "back", // activate backface culling
      },
  });
  
}

function initEvents (GPUApp, scene) {
  let canvaInd = 0;
  while (canvaInd < GPUApp.listCanvases.length){
    let canvas =  GPUApp.listCanvases[canvaInd];
    canvas.addEventListener("mousedown", e => {
      scene.camera.lastX = e.clientX;
      scene.camera.lastY = e.clientY;

      if (e.button === 0) scene.camera.dragging = true;   // left = rotate
      if (e.button === 1 || e.button === 2) scene.camera.panning = true; // middle/right = pan
    });

    window.addEventListener("mouseup", () => {
      scene.camera.dragging = false;
      scene.camera.panning = false;
    });

    canvas.addEventListener("mousemove", e => {
      const dx = e.clientX - scene.camera.lastX;
      const dy = e.clientY - scene.camera.lastY;
      scene.camera.lastX = e.clientX;
      scene.camera.lastY = e.clientY;

      if (scene.camera.dragging) {
        scene.camera.yaw   -= dx * scene.camera.rotateSpeed;
        scene.camera.pitch += dy * scene.camera.rotateSpeed;

        const maxPitch = Math.PI / 2 - 0.01;
        scene.camera.pitch = Math.max(-maxPitch, Math.min(maxPitch, scene.camera.pitch));
      }

      if (scene.camera.panning) {
        pan(scene.camera, dx, -dy);
      }
    });

    canvas.addEventListener("wheel", e => {
      e.preventDefault();
      scene.camera.radius *= 1 + e.deltaY * scene.camera.zoomSpeed;
      scene.camera.radius = Math.max(scene.camera.minRadius, Math.min(scene.camera.maxRadius, scene.camera.radius));
    }, { passive: false });

    canvas.addEventListener("contextmenu", e => e.preventDefault());
        
    // canvas.addEventListener("mouseenter", () => {
    //   canvas.width = 512;
    //   canvas.height = 384;
    // });

    // canvas.addEventListener("mouseleave", () => {
    //   canvas.width = 512;
    //   canvas.height = 384;
    // });
    
    canvaInd++;
  }
  const checkbox = document.getElementById("pipelineCheckbox");
  const pipelineView = document.getElementById("pipelineView");
  const singleView = document.getElementById("singleView");

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      pipelineView.style.display = "block";
      singleView.style.display = "none";
    } else {
      pipelineView.style.display = "none";
      singleView.style.display = "block";
    }
  });
}

function animate(scene, time) {
  scene.time = time;
  var t = time * 0.05;
  const angle = t/40.0;
  const radius = 1.0;
  scene.lightSources[scene.lightSources.length-1].position = [radius*Math.cos (angle), 0.9, radius*Math.sin (angle)];
}

function updateUniforms(GPUApp, scene) {
  updateCamera(scene.camera);
  GPUApp.uniformData.set(scene.camera.modelMat, 0);
  GPUApp.uniformData.set(scene.camera.viewMat, 16);
  const invViewMat = mat4Invert (scene.camera.viewMat);
  GPUApp.uniformData.set(invViewMat, 32);
  const transInvViewMat = mat4Transpose (invViewMat);
  GPUApp.uniformData.set(transInvViewMat, 48);        
  GPUApp.uniformData.set(scene.camera.projMat, 64);        
  GPUApp.uniformData[80] = scene.camera.fov;
  GPUApp.uniformData[81] = scene.camera.aspect;
  GPUApp.uniformData[84] = scene.meshes.length;
  GPUApp.uniformData[85] = scene.lightSources.length;
  GPUApp.device.queue.writeBuffer(
    GPUApp.uniformBuffer,
    0,
    GPUApp.uniformData.buffer,
    GPUApp.uniformData.byteOffset,
    GPUApp.uniformData.byteLength
  );
}

function displayPass(GPUApp, view, bind){
  const encoder = GPUApp.device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    label: "display pass",
    colorAttachments: [{
      view: view,
      loadOp: "load",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    }],
  });
  pass.setPipeline(GPUApp.displayPipeline);
  pass.setBindGroup(0, bind);
  pass.draw(6);
  pass.end();
  GPUApp.device.queue.submit([encoder.finish()]);
}

function renderFrame(GPUApp, scene, time) {
  if (document.getElementById("animateCheckbox").checked)
    animate(scene, time);

  const matteView = GPUApp.matteContext.getCurrentTexture().createView();
  const diffuseView = GPUApp.diffuseContext.getCurrentTexture().createView();
  const depthView = GPUApp.depthContext.getCurrentTexture().createView();
  const specularView = GPUApp.specularContext.getCurrentTexture().createView();
  
  let finalView = GPUApp.context.getCurrentTexture().createView();
  if (document.getElementById("pipelineCheckbox").checked){
    finalView = GPUApp.lilcontext.getCurrentTexture().createView();
  }

  updateUniforms(GPUApp, scene);
  updateMaterialBuffer(GPUApp, scene.materials);
  updateLightSourceBuffer(GPUApp, scene.lightSources);
  const encoder1 = GPUApp.device.createCommandEncoder();
  const pass1 = encoder1.beginRenderPass({
    label: "Main rendering pass",
    colorAttachments: [{
      view: GPUApp.diffuseTexture.createView(),
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    },
    {
      view: GPUApp.matteTexture.createView(),
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    },
    {
      view: GPUApp.specularTexture.createView(),
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    }
  ],
    sampleCount: 1,
    depthStencilAttachment: {
      view: GPUApp.depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  });
  
  pass1.setPipeline(GPUApp.rasterizationPipeline);
  
  pass1.setBindGroup(0, GPUApp.bindGroup);
  for (var i = 0; i < scene.meshes.length; i++) {
    pass1.draw(scene.meshes[i].indices.length, 1, 0, i);
  }
  pass1.end();
  GPUApp.device.queue.submit([encoder1.finish()]);
  
  const encoder2 = GPUApp.device.createCommandEncoder();
  const pass2 = encoder2.beginRenderPass({
    label: "Depth read pass",
    colorAttachments: [{
      view: GPUApp.depthTextureFinal.createView(),
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    }],
  });
  pass2.setPipeline(GPUApp.depthPipeline);
  pass2.setBindGroup(0, GPUApp.bindGroupDepth);
  for (var i = 0; i < scene.meshes.length; i++) {
    pass2.draw(scene.meshes[i].indices.length, 1, 0, i);
  }
  pass2.end();
  GPUApp.device.queue.submit([encoder2.finish()]);
  
  displayPass(GPUApp, matteView, GPUApp.bindGroupMatte);
  displayPass(GPUApp, diffuseView, GPUApp.bindGroupDiffuse);
  displayPass(GPUApp, depthView, GPUApp.bindGroupDepthDisplay);
  displayPass(GPUApp, specularView, GPUApp.bindGroupSpecular);

  
  const final_encoder = GPUApp.device.createCommandEncoder();
  const final_pass = final_encoder.beginRenderPass({
    label: "final pass",
    colorAttachments: [{
      view: finalView,
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    }],
  });
  final_pass.setPipeline(GPUApp.final_Pipeline);
  final_pass.setBindGroup(0, GPUApp.final_bindGroup);
  final_pass.draw(6);
  final_pass.end();
  GPUApp.device.queue.submit([final_encoder.finish()]);

  requestAnimationFrame(function(time) {renderFrame (GPUApp, scene, time)});
}


async function main() {
  const GPUApp = await createGPUApp();
  const camAspect = GPUApp.canvas.width/GPUApp.canvas.height;
  initRenderPipeline(GPUApp);
  const scene = await createScene(camAspect);
  initEvents(GPUApp, scene);
  initGPUBuffers(GPUApp, scene);
  renderFrame(GPUApp, scene, 0);
}

main();