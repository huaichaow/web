var g=Object.defineProperty;var x=(l,t,e)=>t in l?g(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var r=(l,t,e)=>x(l,typeof t!="symbol"?t+"":t,e);import{V as v,C as m,I as b,a as T}from"./index-CB7oPzLX.js";const y=`struct Camera {
  viewProj : mat4x4f,
  position : vec4f,
  // x = time (seconds), y = world radius, z/w unused
  params   : vec4f,
};

struct Instance {
  model  : mat4x4f,
  color  : vec4f,
  // x = material (0 = matte, 1 = gold); yzw = emissive factor multiplied with the emissive texture
  params : vec4f,
};

@group(0) @binding(0) var<uniform> camera : Camera;
@group(1) @binding(0) var<storage, read> instances : array<Instance>;
@group(2) @binding(0) var emissiveTex : texture_2d<f32>;
@group(2) @binding(1) var texSampler : sampler;

struct VertexIn {
  @builtin(instance_index) instanceIndex : u32,
  @location(0) position : vec3f,
  @location(1) normal   : vec3f,
  @location(2) uv       : vec2f,
};

struct VertexOut {
  @builtin(position) clipPos : vec4f,
  @location(0) worldPos : vec3f,
  @location(1) normal   : vec3f,
  @location(2) color    : vec3f,
  @location(3) @interpolate(flat) material : f32,
  @location(4) uv       : vec2f,
  @location(5) @interpolate(flat) emissive : vec3f,
};

@vertex
fn vertexMain(in : VertexIn) -> VertexOut {
  let inst = instances[in.instanceIndex];
  let world = inst.model * vec4f(in.position, 1.0);
  var out : VertexOut;
  out.clipPos = camera.viewProj * world;
  out.worldPos = world.xyz;
  // Uniform scale only, so the model matrix's upper 3x3 preserves normal direction.
  out.normal = normalize((inst.model * vec4f(in.normal, 0.0)).xyz);
  out.color = inst.color.rgb;
  out.material = inst.params.x;
  out.uv = in.uv;
  out.emissive = inst.params.yzw;
  return out;
}

const LIGHT_DIR = vec3f(0.25, 0.5, 1.0);
const FILL_DIR = vec3f(-0.6, -0.3, -0.7);
const FOG_COLOR = vec3f(0.02, 0.02, 0.05);

@fragment
fn fragmentMain(in : VertexOut) -> @location(0) vec4f {
  let n = normalize(in.normal);
  let l = normalize(LIGHT_DIR);
  let v = normalize(camera.position.xyz - in.worldPos);
  let time = camera.params.x;
  let worldRadius = camera.params.y;

  // Sampled unconditionally to keep control flow uniform; clutter binds a 1x1 black texture.
  let emissiveSample = textureSample(emissiveTex, texSampler, in.uv).rgb;

  var rgb : vec3f;
  if (in.material > 0.5) {
    // The One Ring: polished gold. Two Blinn-Phong highlights (key + fill), a fresnel rim so the
    // silhouette catches light from any angle, the model's emissive inscription, and a slow pulse.
    let gold = in.color;
    let f = normalize(FILL_DIR);
    let ndl = max(dot(n, l), 0.0);
    let ndf = max(dot(n, f), 0.0);
    let ndv = max(dot(n, v), 0.0);
    let specKey = pow(max(dot(n, normalize(l + v)), 0.0), 48.0);
    let specFill = pow(max(dot(n, normalize(f + v)), 0.0), 32.0) * 0.5;
    let rim = pow(1.0 - ndv, 3.0) * 0.6;
    let pulse = 0.5 + 0.5 * sin(time * 2.0);
    let diffuse = gold * (0.12 + 0.55 * ndl + 0.25 * ndf);
    let emissive = emissiveSample * in.emissive * (0.6 + 0.4 * pulse);
    rgb = diffuse + gold * rim + vec3f(1.0, 0.96, 0.85) * (specKey + specFill) + gold * 0.12 * pulse + emissive;
  } else {
    let ndl = max(dot(n, l), 0.0);
    let fill = max(dot(n, normalize(FILL_DIR)), 0.0) * 0.25;
    rgb = in.color * (0.22 + 0.78 * ndl + fill);
  }

  // Linear fog toward the background so distant clutter fades and depth reads clearly.
  let dist = length(camera.position.xyz - in.worldPos);
  let fog = smoothstep(worldRadius * 0.6, worldRadius * 1.6, dist);
  rgb = mix(rgb, FOG_COLOR, fog);
  return vec4f(rgb, 1.0);
}
`,f="depth24plus",c=4,G={r:.02,g:.02,b:.05,a:1};class P{constructor(t){r(this,"backend","webgpu");r(this,"maxTextureDimension");r(this,"device");r(this,"pipeline");r(this,"instanceLayout");r(this,"textureLayout");r(this,"sampler");r(this,"cameraBuffer");r(this,"cameraBindGroup");r(this,"blackTextureBindGroup");r(this,"depthTexture",null);r(this,"msaaTexture",null);r(this,"targetWidth",0);r(this,"targetHeight",0);r(this,"mipPipeline",null);r(this,"mipSampler",null);r(this,"mipLayout",null);this.gpu=t;const{device:e,format:i}=t;this.device=e,this.maxTextureDimension=e.limits.maxTextureDimension2D;const a=e.createBindGroupLayout({label:"Camera",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.instanceLayout=e.createBindGroupLayout({label:"Instances",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),this.textureLayout=e.createBindGroupLayout({label:"Material texture",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),this.sampler=e.createSampler({label:"Linear repeat",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});const n=e.createShaderModule({label:"Scene shader",code:y});this.pipeline=e.createRenderPipeline({label:"Scene",layout:e.createPipelineLayout({bindGroupLayouts:[a,this.instanceLayout,this.textureLayout]}),vertex:{module:n,entryPoint:"vertexMain",buffers:[{arrayStride:v,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]}]},fragment:{module:n,entryPoint:"fragmentMain",targets:[{format:i}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{format:f,depthWriteEnabled:!0,depthCompare:"less"},multisample:{count:c}}),this.cameraBuffer=e.createBuffer({label:"Camera uniform",size:m*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.cameraBindGroup=e.createBindGroup({label:"Camera",layout:a,entries:[{binding:0,resource:{buffer:this.cameraBuffer}}]});const s=e.createTexture({label:"Black 1x1",size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:s},new Uint8Array([0,0,0,255]),{bytesPerRow:4},{width:1,height:1}),this.blackTextureBindGroup=this.createTextureBindGroup("Black",s)}createTexture(t,e){const{device:i}=this,a=1+Math.floor(Math.log2(Math.max(e.width,e.height))),n=i.createTexture({label:t,size:{width:e.width,height:e.height},format:"rgba8unorm",mipLevelCount:a,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});return i.queue.copyExternalImageToTexture({source:e},{texture:n},{width:e.width,height:e.height}),a>1&&this.generateMipmaps(n,a),{label:t,texture:n}}createDrawable(t,e,i,a){const{device:n}=this,s=n.createBuffer({label:`${t} vertices`,size:e.vertices.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0});new Float32Array(s.getMappedRange()).set(e.vertices),s.unmap();const o=Math.ceil(e.indices.byteLength/4)*4,u=n.createBuffer({label:`${t} indices`,size:o,usage:GPUBufferUsage.INDEX,mappedAtCreation:!0}),d=e.indices instanceof Uint32Array;d?new Uint32Array(u.getMappedRange()).set(e.indices):new Uint16Array(u.getMappedRange()).set(e.indices),u.unmap();const p=n.createBuffer({label:`${t} instances`,size:Math.max(1,i)*b,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=n.createBindGroup({label:`${t} instances`,layout:this.instanceLayout,entries:[{binding:0,resource:{buffer:p}}]});return{label:t,vertexBuffer:s,indexBuffer:u,indexFormat:d?"uint32":"uint16",indexCount:e.indexCount,instanceBuffer:p,capacity:i,instanceCount:0,bindGroup:h,textureBindGroup:a?this.createTextureBindGroup(t,a.texture):this.blackTextureBindGroup}}writeInstances(t,e,i){if(i>t.capacity)throw new Error(`${t.label}: ${i} instances exceed capacity ${t.capacity}`);t.instanceCount=i,i>0&&this.device.queue.writeBuffer(t.instanceBuffer,0,e,0,i*T)}render(t,e){const{device:i,gpu:a}=this;if(this.ensureTargets(),!this.depthTexture||!this.msaaTexture)return;i.queue.writeBuffer(this.cameraBuffer,0,e,0,m);const n=i.createCommandEncoder({label:"Frame"}),s=n.beginRenderPass({label:"Scene",colorAttachments:[{view:this.msaaTexture.createView(),resolveTarget:a.context.getCurrentTexture().createView(),clearValue:G,loadOp:"clear",storeOp:"discard"}],depthStencilAttachment:{view:this.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});s.setPipeline(this.pipeline),s.setBindGroup(0,this.cameraBindGroup);for(const o of t)o.instanceCount!==0&&(s.setBindGroup(1,o.bindGroup),s.setBindGroup(2,o.textureBindGroup),s.setVertexBuffer(0,o.vertexBuffer),s.setIndexBuffer(o.indexBuffer,o.indexFormat),s.drawIndexed(o.indexCount,o.instanceCount));s.end(),i.queue.submit([n.finish()])}createTextureBindGroup(t,e){return this.device.createBindGroup({label:`${t} texture`,layout:this.textureLayout,entries:[{binding:0,resource:e.createView()},{binding:1,resource:this.sampler}]})}generateMipmaps(t,e){const{device:i}=this;if(!this.mipPipeline||!this.mipSampler||!this.mipLayout){const n=i.createShaderModule({label:"Mipmap blit",code:`
          struct Out { @builtin(position) pos : vec4f, @location(0) uv : vec2f };
          @vertex fn vs(@builtin(vertex_index) i : u32) -> Out {
            let uv = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
            var o : Out;
            o.pos = vec4f(uv * 2.0 - 1.0, 0.0, 1.0);
            o.uv = vec2f(uv.x, 1.0 - uv.y);
            return o;
          }
          @group(0) @binding(0) var src : texture_2d<f32>;
          @group(0) @binding(1) var smp : sampler;
          @fragment fn fs(in : Out) -> @location(0) vec4f { return textureSample(src, smp, in.uv); }
        `});this.mipLayout=i.createBindGroupLayout({label:"Mipmap blit",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{}}]}),this.mipPipeline=i.createRenderPipeline({label:"Mipmap blit",layout:i.createPipelineLayout({bindGroupLayouts:[this.mipLayout]}),vertex:{module:n,entryPoint:"vs"},fragment:{module:n,entryPoint:"fs",targets:[{format:"rgba8unorm"}]},primitive:{topology:"triangle-list"}}),this.mipSampler=i.createSampler({minFilter:"linear",magFilter:"linear"})}const a=i.createCommandEncoder({label:"Generate mipmaps"});for(let n=1;n<e;n++){const s=i.createBindGroup({layout:this.mipLayout,entries:[{binding:0,resource:t.createView({baseMipLevel:n-1,mipLevelCount:1})},{binding:1,resource:this.mipSampler}]}),o=a.beginRenderPass({colorAttachments:[{view:t.createView({baseMipLevel:n,mipLevelCount:1}),loadOp:"clear",storeOp:"store"}]});o.setPipeline(this.mipPipeline),o.setBindGroup(0,s),o.draw(3),o.end()}i.queue.submit([a.finish()])}ensureTargets(){var a,n;const{canvas:t}=this.gpu,e=Math.max(1,t.width),i=Math.max(1,t.height);this.depthTexture&&this.msaaTexture&&e===this.targetWidth&&i===this.targetHeight||((a=this.depthTexture)==null||a.destroy(),(n=this.msaaTexture)==null||n.destroy(),this.targetWidth=e,this.targetHeight=i,this.depthTexture=this.device.createTexture({label:"Depth",size:{width:e,height:i},format:f,sampleCount:c,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.msaaTexture=this.device.createTexture({label:"MSAA color",size:{width:e,height:i},format:this.gpu.format,sampleCount:c,usage:GPUTextureUsage.RENDER_ATTACHMENT}))}}export{P as WebGpuRenderer};
