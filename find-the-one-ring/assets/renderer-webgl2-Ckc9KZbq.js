var F=Object.defineProperty;var U=(n,e,a)=>e in n?F(n,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[e]=a;var i=(n,e,a)=>U(n,typeof e!="symbol"?e+"":e,a);import{C as h,V as u,I as l,a as w}from"./index-C4FZ2C6W.js";const C=`#version 300 es
// GLSL ES port of scene.wgsl's fragmentMain for the WebGL2 fallback. Keep the two in sync.
precision highp float;

layout(std140) uniform Camera {
  mat4 viewProj;
  vec4 position;
  vec4 params;
} camera;

uniform sampler2D emissiveTex;

in vec3 vWorldPos;
in vec3 vNormal;
in vec3 vColor;
flat in float vMaterial;
in vec2 vUv;
flat in vec3 vEmissive;

out vec4 fragColor;

const vec3 LIGHT_DIR = vec3(0.25, 0.5, 1.0);
const vec3 FILL_DIR = vec3(-0.6, -0.3, -0.7);
const vec3 FOG_COLOR = vec3(0.02, 0.02, 0.05);

void main() {
  vec3 n = normalize(vNormal);
  vec3 l = normalize(LIGHT_DIR);
  vec3 v = normalize(camera.position.xyz - vWorldPos);
  float time = camera.params.x;
  float worldRadius = camera.params.y;

  // Sampled unconditionally to keep control flow uniform; clutter binds a 1x1 black texture.
  vec3 emissiveSample = texture(emissiveTex, vUv).rgb;

  vec3 rgb;
  if (vMaterial > 0.5) {
    // The One Ring: polished gold. Two Blinn-Phong highlights (key + fill), a fresnel rim so the
    // silhouette catches light from any angle, the model's emissive inscription, and a slow pulse.
    vec3 gold = vColor;
    vec3 f = normalize(FILL_DIR);
    float ndl = max(dot(n, l), 0.0);
    float ndf = max(dot(n, f), 0.0);
    float ndv = max(dot(n, v), 0.0);
    float specKey = pow(max(dot(n, normalize(l + v)), 0.0), 48.0);
    float specFill = pow(max(dot(n, normalize(f + v)), 0.0), 32.0) * 0.5;
    float rim = pow(1.0 - ndv, 3.0) * 0.6;
    float pulse = 0.5 + 0.5 * sin(time * 2.0);
    vec3 diffuse = gold * (0.12 + 0.55 * ndl + 0.25 * ndf);
    vec3 emissive = emissiveSample * vEmissive * (0.6 + 0.4 * pulse);
    rgb = diffuse + gold * rim + vec3(1.0, 0.96, 0.85) * (specKey + specFill) + gold * 0.12 * pulse + emissive;
  } else {
    float ndl = max(dot(n, l), 0.0);
    float fill = max(dot(n, normalize(FILL_DIR)), 0.0) * 0.25;
    rgb = vColor * (0.22 + 0.78 * ndl + fill);
  }

  // Linear fog toward the background so distant clutter fades and depth reads clearly.
  float dist = length(camera.position.xyz - vWorldPos);
  float fog = smoothstep(worldRadius * 0.6, worldRadius * 1.6, dist);
  rgb = mix(rgb, FOG_COLOR, fog);
  fragColor = vec4(rgb, 1.0);
}
`,P=`#version 300 es
// GLSL ES port of scene.wgsl's vertexMain for the WebGL2 fallback.
precision highp float;

// std140: mat4 (64) + vec4 (16) + vec4 (16) = 96 bytes, the same layout main.ts packs.
layout(std140) uniform Camera {
  mat4 viewProj;
  vec4 position;
  // x = time (seconds), y = world radius, z/w unused
  vec4 params;
} camera;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUv;
// Per-instance attributes (divisor 1), 24 floats matching \`struct Instance\`: mat4 spans locations 3..6.
layout(location = 3) in mat4 aModel;
layout(location = 7) in vec4 aColor;
// x = material (0 = matte, 1 = gold); yzw = emissive factor multiplied with the emissive texture
layout(location = 8) in vec4 aParams;

out vec3 vWorldPos;
out vec3 vNormal;
out vec3 vColor;
flat out float vMaterial;
out vec2 vUv;
flat out vec3 vEmissive;

void main() {
  vec4 world = aModel * vec4(aPosition, 1.0);
  vec4 clip = camera.viewProj * world;
  // The camera builds a WebGPU-style 0..1 depth projection (and picking.ts unprojects with z = 0 / 1).
  // WebGL clips z to -w..w, so remap here instead of touching the shared camera/picking math.
  clip.z = clip.z * 2.0 - clip.w;
  gl_Position = clip;
  vWorldPos = world.xyz;
  // Uniform scale only, so the model matrix's upper 3x3 preserves normal direction.
  vNormal = normalize((aModel * vec4(aNormal, 0.0)).xyz);
  vColor = aColor.rgb;
  vMaterial = aParams.x;
  vUv = aUv;
  vEmissive = aParams.yzw;
}
`,f=[.02,.02,.05,1],A=0,S=3,v=7,E=8;class _{constructor(e){i(this,"backend","webgl2");i(this,"maxTextureDimension");i(this,"program");i(this,"cameraBuffer");i(this,"blackTexture");this.gl=e,this.maxTextureDimension=e.getParameter(e.MAX_TEXTURE_SIZE),this.program=I(e,P,C),e.useProgram(this.program);const a=e.getUniformBlockIndex(this.program,"Camera");e.uniformBlockBinding(this.program,a,A);const t=e.getUniformLocation(this.program,"emissiveTex");e.uniform1i(t,0),this.cameraBuffer=m(e),e.bindBuffer(e.UNIFORM_BUFFER,this.cameraBuffer),e.bufferData(e.UNIFORM_BUFFER,h*4,e.DYNAMIC_DRAW),e.bindBufferBase(e.UNIFORM_BUFFER,A,this.cameraBuffer),this.blackTexture=T(e),e.bindTexture(e.TEXTURE_2D,this.blackTexture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),x(e,!1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.enable(e.CULL_FACE),e.cullFace(e.BACK),e.frontFace(e.CCW),e.clearColor(f[0],f[1],f[2],f[3]),e.clearDepth(1)}static create(e,a){const t=e.getContext("webgl2",{alpha:!1,antialias:!0,depth:!0,stencil:!1,powerPreference:"high-performance"});if(!t)throw new Error("This browser does not expose WebGL2. Check that hardware acceleration is enabled.");return e.addEventListener("webglcontextlost",o=>{o.preventDefault(),a("The graphics context was lost. Reload the page to try again.")}),new _(t)}createTexture(e,a){const{gl:t}=this,o=T(t);return t.bindTexture(t.TEXTURE_2D,o),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,t.RGBA,t.UNSIGNED_BYTE,a),t.generateMipmap(t.TEXTURE_2D),x(t,!0),{label:e,texture:o}}createDrawable(e,a,t,o){const{gl:r}=this,s=r.createVertexArray();if(!s)throw new Error(`${e}: could not create a vertex array object`);r.bindVertexArray(s);const b=m(r);r.bindBuffer(r.ARRAY_BUFFER,b),r.bufferData(r.ARRAY_BUFFER,a.vertices,r.STATIC_DRAW),r.enableVertexAttribArray(0),r.vertexAttribPointer(0,3,r.FLOAT,!1,u,0),r.enableVertexAttribArray(1),r.vertexAttribPointer(1,3,r.FLOAT,!1,u,12),r.enableVertexAttribArray(2),r.vertexAttribPointer(2,2,r.FLOAT,!1,u,24);const R=m(r);r.bindBuffer(r.ARRAY_BUFFER,R),r.bufferData(r.ARRAY_BUFFER,Math.max(1,t)*l,r.DYNAMIC_DRAW);for(let c=0;c<4;c++){const d=S+c;r.enableVertexAttribArray(d),r.vertexAttribPointer(d,4,r.FLOAT,!1,l,c*16),r.vertexAttribDivisor(d,1)}r.enableVertexAttribArray(v),r.vertexAttribPointer(v,4,r.FLOAT,!1,l,64),r.vertexAttribDivisor(v,1),r.enableVertexAttribArray(E),r.vertexAttribPointer(E,4,r.FLOAT,!1,l,80),r.vertexAttribDivisor(E,1);const L=m(r);return r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,L),r.bufferData(r.ELEMENT_ARRAY_BUFFER,a.indices,r.STATIC_DRAW),r.bindVertexArray(null),{label:e,capacity:t,instanceCount:0,vao:s,instanceBuffer:R,indexType:a.indices instanceof Uint32Array?r.UNSIGNED_INT:r.UNSIGNED_SHORT,indexCount:a.indexCount,texture:o?o.texture:this.blackTexture}}writeInstances(e,a,t){if(t>e.capacity)throw new Error(`${e.label}: ${t} instances exceed capacity ${e.capacity}`);if(e.instanceCount=t,t>0){const{gl:o}=this;o.bindBuffer(o.ARRAY_BUFFER,e.instanceBuffer),o.bufferSubData(o.ARRAY_BUFFER,0,a,0,t*w)}}render(e,a){const{gl:t}=this,{canvas:o}=t;t.viewport(0,0,Math.max(1,o.width),Math.max(1,o.height)),t.bindBuffer(t.UNIFORM_BUFFER,this.cameraBuffer),t.bufferSubData(t.UNIFORM_BUFFER,0,a,0,h),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(this.program),t.activeTexture(t.TEXTURE0);for(const r of e)r.instanceCount!==0&&(t.bindVertexArray(r.vao),t.bindTexture(t.TEXTURE_2D,r.texture),t.drawElementsInstanced(t.TRIANGLES,r.indexCount,r.indexType,0,r.instanceCount));t.bindVertexArray(null)}}function m(n){const e=n.createBuffer();if(!e)throw new Error("Could not create a WebGL buffer");return e}function T(n){const e=n.createTexture();if(!e)throw new Error("Could not create a WebGL texture");return e}function x(n,e){n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,e?n.LINEAR_MIPMAP_LINEAR:n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.REPEAT)}function p(n,e,a){const t=n.createShader(e);if(!t)throw new Error("Could not create a WebGL shader");if(n.shaderSource(t,a),n.compileShader(t),!n.getShaderParameter(t,n.COMPILE_STATUS)){const o=n.getShaderInfoLog(t)??"unknown error";throw n.deleteShader(t),new Error(`${e===n.VERTEX_SHADER?"Vertex":"Fragment"} shader failed to compile: ${o}`)}return t}function I(n,e,a){const t=n.createProgram();if(!t)throw new Error("Could not create a WebGL program");const o=p(n,n.VERTEX_SHADER,e),r=p(n,n.FRAGMENT_SHADER,a);if(n.attachShader(t,o),n.attachShader(t,r),n.linkProgram(t),n.deleteShader(o),n.deleteShader(r),!n.getProgramParameter(t,n.LINK_STATUS)){const s=n.getProgramInfoLog(t)??"unknown error";throw n.deleteProgram(t),new Error(`Shader program failed to link: ${s}`)}return t}export{_ as WebGl2Renderer};
