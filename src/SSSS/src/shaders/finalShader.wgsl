@group(0) @binding(0) var diffuseTexture: texture_2d<f32>;
@group(0) @binding(1) var matteTexture: texture_2d<f32>;
@group(0) @binding(2) var depthTexture: texture_2d<f32>;
@group(0) @binding(3) var specularTexture: texture_2d<f32>;
@group(0) @binding(4) var pointerSampler: sampler;
@group(0) @binding(5) var linearSampler: sampler;


struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) uv : vec2<f32>,
};



//float4 BlurPS(PassV2P input, uniform float2 step) : SV_TARGET {
    // Gaussian weights for the six samples around the current pixel:
    //   -3 -2 -1 +1 +2 +3
//    float w[6] = { 0.006,   0.061,   0.242,  0.242,  0.061, 0.006 };
//    float o[6] = {  -1.0, -0.6667, -0.3333, 0.3333, 0.6667,   1.0 };

    // Fetch color and linear depth for current pixel:
//    float4 colorM = colorTex.Sample(PointSampler, input.texcoord);
//    float depthM = depthTex.Sample(PointSampler, input.texcoord);

//    // Accumulate center sample, multiplying it with its gaussian weight:
//    float4 colorBlurred = colorM;
//    colorBlurred.rgb *= 0.382;

    // Calculate the step that we will use to fetch the surrounding pixels,
    // where "step" is:
    //     step = sssStrength * gaussianWidth * pixelSize * dir
    // The closer the pixel, the stronger the effect needs to be, hence
    // the factor 1.0 / depthM.
//    float2 finalStep = colorM.a * step / depthM;

    // Accumulate the other samples:
//    [unroll]
//    for (int i = 0; i < 6; i++) {
        // Fetch color and depth for current sample:
//        float2 offset = input.texcoord + o[i] * finalStep;
//        float3 color = colorTex.SampleLevel(LinearSampler, offset, 0).rgb;
//        float depth = depthTex.SampleLevel(PointSampler, offset, 0);

        // If the difference in depth is huge, we lerp color back to "colorM":
//        float s = min(0.0125 * correction * abs(depthM - depth), 1.0);
//        color = lerp(color, colorM.rgb, s);

        // Accumulate:
//        colorBlurred.rgb += w[i] * color;
//    }

    // The result will be alpha blended with current buffer by using specific
    // RGB weights. For more details, I refer you to the GPU Pro chapter :)
//    return colorBlurred;
//}

fn lerp(vec1: vec3f, vec2: vec3f, s: f32) -> vec3f {
    return vec1 + s * (vec2 - vec1);
}

fn bluurrr(input: VertexOutput, step: vec2f) -> vec4f {
    let colorM = textureSample(diffuseTexture, pointerSampler, input.uv);
    let depthM = textureSample(depthTexture, pointerSampler, input.uv).x;

    // Gaussian weights for the six samples around the current pixel:
    //   -3 -2 -1 +1 +2 +3
    let w = array<f32, 6>(
        0.006, 0.061, 0.242,
        0.242, 0.061, 0.006
    );
    let o = array<f32, 6>(
        -1.0, -0.6667, -0.3333,
        0.3333,  0.6667,  1.0
    );

    var colorBlurred = colorM;
    colorBlurred.r *= 0.382;
    colorBlurred.g *= 0.382;
    colorBlurred.b *= 0.382;
    
    //depth gradient
    let gradX = abs(dpdx(depthM));
    let gradY = abs(dpdy(depthM));
    let alpha = 16.0;
    let beta = 800.0;
    let stretch = select(
        alpha * depthM + beta * gradY, // Y
        alpha * depthM + beta * gradX, // X
        step.x > 0.0
    );
    let finalStep = stretch * step;
    //let finalStep = colorM.a * step / depthM;

    var i = 0;
    while(i<6){
        let offset = input.uv + o[i] * finalStep;
        var color = textureSample(diffuseTexture, linearSampler, offset).rgb;
        let depth = textureSample(depthTexture, pointerSampler, offset).x;

        let correction = 1.000f;
        let s = min(0.0125 * correction * abs(depthM - depth), 1.0);
        color = lerp(color, colorM.rgb, s);

        colorBlurred.r += w[i] * color.r;
        colorBlurred.g += w[i] * color.g;
        colorBlurred.b += w[i] * color.b;
        i++;
    }
    return colorBlurred;
}


@vertex
fn finalVertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(1.0, 1.0)
    );

    var uvs = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(1.0, 0.0)
    );

    var output: VertexOutput;
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.uv = uvs[vertexIndex];
    return output;
}

@fragment
fn finalFragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let matteColor = textureSample(matteTexture, pointerSampler, input.uv).r;
    let specularColor = textureSample(specularTexture, pointerSampler, input.uv);
    let baseColor = textureSample(diffuseTexture, pointerSampler, input.uv);
    
    let texSize = vec2f(textureDimensions(diffuseTexture));
    let stepx = vec2f(1.0 / texSize.x, 0.0);
    let stepy = vec2f(0.0, 1.0 / texSize.y);
    let blurrColorx = bluurrr(input, stepx);
    let blurrColory = bluurrr(input, stepy);
    let blurrColor = 0.5*(blurrColorx+blurrColory);
    
    let blurredColor = mix(baseColor, blurrColor, matteColor);

    return vec4f(blurredColor.rgb + specularColor.rgb, 1.0f);
}