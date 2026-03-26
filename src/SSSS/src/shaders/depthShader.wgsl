const PI = 3.14159265358979323846;
const INV_PI = 1.0/3.14159265358979323846;
const EPSILON = 1e-6;

struct LightSource {
position: vec3<f32>,
intensity: f32,
color: vec3<f32>,
angle: f32,
spot: vec3<f32>,
};

struct Material {
albedo: vec3<f32>,
_pad2: f32 // Required for uniform buffer alignment
};

struct Camera {
modelMat: mat4x4<f32>,
viewMat: mat4x4<f32>,
invViewMat: mat4x4<f32>,
transInvViewMat: mat4x4<f32>,
projMat: mat4x4<f32>,
fov: f32,
aspectRatio: f32,
_pad: vec2<f32> // Required for uniform buffer alignment
};

struct Mesh {
    posOffset: u32, // in vertices, used for all attribute buffer for now
    triOffset: u32, // in triangles
    numOfTriangles: u32,  
    materialIndex: u32, // index over the material buffer
};

struct Scene {
camera: Camera,
numOfMeshes: f32,
numOfLightSources: f32,
_pad: vec2<f32> // Required for uniform buffer alignment
};

@group(0) @binding(0)
var<uniform> scene : Scene; // The only uniform buffer, as the camera paramters change frequently

@group(0) @binding(1)
var<storage, read> positions : array<f32>; // Packed positions for all meshes

@group(0) @binding(2)
var<storage, read> normals : array<f32>; // Packed normals for all meshes

@group(0) @binding(3)
var<storage, read> triangles : array<u32>; // Packed triangles for all meshes

@group(0) @binding(4)
var<storage, read> meshes : array<Mesh>; // The scene's meshes

@group(0) @binding(5)
var<storage, read> materials : array<Material>; // matei

@group(0) @binding(6)
var<storage, read> lightSources : array<LightSource>;


@group(0) @binding(7) var texture: texture_2d<f32>;
@group(0) @binding(8) var textureSampler: sampler;
@group(0) @binding(9) var<storage,read> uvs : array<f32>;

@group(0) @binding(10) var depthTexture : texture_depth_2d;
@group(0) @binding(11) var depthTextureSampler : sampler; // any sampler

struct RasterVertexInput {
@builtin(vertex_index) vertexIndex: u32,
@builtin(instance_index) meshIndex: u32
};

// output of the vertex shader (includes built-in position)
struct RasterVertexOutput {
    @builtin(position) builtInPos : vec4f,
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
    @location(2) uv: vec2f,
    @location(3) @interpolate(flat) materialIndex: u32,
};

// input to the fragment shader (no builtin position, it will be
// supplied separately via a standalone parameter)
struct RasterFragmentInput {
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
    @location(2) uv: vec2f,
    @location(3) @interpolate(flat) materialIndex: u32,
};

struct FragmentOutput {
@location(0) diffuse : vec4f,
@location(1) matte : f32,
}

fn getVertPos(vertIndex: u32) -> vec3f {
return vec3f (positions[3*vertIndex], positions[3*vertIndex+1], positions[3*vertIndex+2]);
}

fn getVertNormal(vertIndex: u32) -> vec3f {
return vec3f (normals[3*vertIndex], normals[3*vertIndex+1], normals[3*vertIndex+2]);
}

fn getTriangle(triIndex: u32) -> vec3u {
return vec3u (triangles[3*triIndex], triangles[3*triIndex+1], triangles[3*triIndex+2]);
}

fn getVertUV(vertIndex: u32) -> vec2f {
    return vec2f(uvs[2 * vertIndex], uvs[2 * vertIndex + 1]);  // Assuming UVs are packed as [u0, v0, u1, v1, ...]
}


//-----------------------------------------------------------------------
// Rasterization shaders 
//-----------------------------------------------------------------------

@vertex
fn rasterVertexMain(input: RasterVertexInput) -> RasterVertexOutput {
    let cam = scene.camera;
    var mesh = meshes[input.meshIndex];
    let vID = input.vertexIndex;

    // Recovering triangle and vertex from the draw index
    let triIndex = vID / 3u;
    let triVertIndex = vID % 3u;
    let triangle = getTriangle(mesh.triOffset + triIndex);
    let vertIndex = mesh.posOffset + triangle[triVertIndex];
    
    var output: RasterVertexOutput;
    let p = cam.viewMat * cam.modelMat * vec4f(getVertPos(vertIndex), 1.0); 
    output.builtInPos = cam.projMat * p; // Fires rasterization
    output.position = p.xyz;
    let n = cam.transInvViewMat * vec4f(getVertNormal(vertIndex), 1.0);
    output.normal = normalize(n.xyz);
    output.uv = getVertUV(vertIndex);
    output.materialIndex = mesh.materialIndex; 
    return output; 
}
@fragment
fn rasterFragmentMain(input: RasterFragmentInput, @builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
    let near = 0.01;
    let far = 10.0;
    let coords: vec2<i32> = vec2<i32>(fragCoord.xy);
    let d: f32 = textureLoad(depthTexture, coords, 0);
    let linear = (2.0 * near) / (far + near - d * (far - near));
    return vec4f(vec3f(linear), 1.0);
}