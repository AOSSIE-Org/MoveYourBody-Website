/**
 * A recording WebGL2 context for jsdom, which has none. It compiles nothing, but it tracks what a
 * renderer asks for: shader sources, the uniforms each program declares (parsed from its GLSL),
 * the last value set for every uniform, which framebuffer each draw lands in, and deletions.
 */

export interface FakeGLOptions {
  compiles?: boolean;
  links?: boolean;
  halfFloat?: boolean;
  shaders?: boolean;
  programs?: boolean;
}

interface Shader {
  type: number;
  source: string;
}
interface Program {
  shaders: Shader[];
  uniforms: string[];
}
interface Location {
  program: Program;
  name: string;
}

const CONSTANTS = [
  'VERTEX_SHADER',
  'FRAGMENT_SHADER',
  'COMPILE_STATUS',
  'LINK_STATUS',
  'ACTIVE_UNIFORMS',
  'ARRAY_BUFFER',
  'STATIC_DRAW',
  'FLOAT',
  'TEXTURE_2D',
  'TEXTURE_MIN_FILTER',
  'TEXTURE_MAG_FILTER',
  'TEXTURE_WRAP_S',
  'TEXTURE_WRAP_T',
  'LINEAR',
  'CLAMP_TO_EDGE',
  'FRAMEBUFFER',
  'COLOR_ATTACHMENT0',
  'RGBA16F',
  'RGBA8',
  'RGBA',
  'HALF_FLOAT',
  'UNSIGNED_BYTE',
  'TRIANGLES',
  'TEXTURE0',
  'TEXTURE1',
  'TEXTURE2',
] as const;

/** Uniform names a shader declares, with arrays reported as `name[0]` like getActiveUniform does */
function declaredUniforms(source: string) {
  const names: string[] = [];
  for (const [, list] of source.matchAll(/uniform\s+\w+\s+([^;]+);/g)) {
    for (const raw of list.split(',')) {
      const name = raw.trim();
      names.push(name.includes('[') ? name.replace(/\[\d+\]/, '[0]') : name);
    }
  }
  return names;
}

export function createFakeGL({ compiles = true, links = true, halfFloat = true, shaders = true, programs = true }: FakeGLOptions = {}) {
  const constants = Object.fromEntries(CONSTANTS.map((name, i) => [name, 0x1000 + i])) as Record<(typeof CONSTANTS)[number], number>;
  let framebuffer: unknown = null;
  let program: Program | null = null;

  const record = {
    shaderSources: [] as string[],
    linkedPrograms: [] as Program[],
    /** Last value per uniform name, from whichever program set it last */
    uniforms: new Map<string, unknown>(),
    /** Uniform values per program index (0 = first linked) */
    programUniforms: new Map<Program, Map<string, unknown>>(),
    /** Framebuffer bound for each draw call (null = the canvas) */
    draws: [] as unknown[],
    textureFormats: [] as number[],
    deleted: { programs: 0, textures: 0, framebuffers: 0, buffers: 0, vertexArrays: 0, shaders: 0 },
    viewports: [] as number[][],
  };

  const setUniform = (location: Location | null, value: unknown) => {
    if (!location) return;
    record.uniforms.set(location.name, value);
    const map = record.programUniforms.get(location.program) ?? new Map();
    map.set(location.name, value);
    record.programUniforms.set(location.program, map);
  };

  const gl = {
    ...constants,
    createShader: (type: number): Shader | null => (shaders ? { type, source: '' } : null),
    shaderSource: (shader: Shader, source: string) => {
      shader.source = source;
      record.shaderSources.push(source);
    },
    compileShader: () => {},
    getShaderParameter: () => compiles,
    getShaderInfoLog: () => 'ERROR: 0:1: syntax error',
    deleteShader: () => {
      record.deleted.shaders++;
    },
    createProgram: (): Program | null => (programs ? { shaders: [], uniforms: [] } : null),
    attachShader: (p: Program, s: Shader) => {
      p.shaders.push(s);
    },
    detachShader: () => {},
    bindAttribLocation: () => {},
    linkProgram: (p: Program) => {
      p.uniforms = p.shaders.flatMap((s) => declaredUniforms(s.source));
      if (links) record.linkedPrograms.push(p);
    },
    getProgramParameter: (p: Program, pname: number) => {
      if (pname === constants.LINK_STATUS) return links;
      if (pname === constants.ACTIVE_UNIFORMS) return p.uniforms.length;
      return null;
    },
    getProgramInfoLog: () => '',
    getActiveUniform: (p: Program, i: number) => ({ name: p.uniforms[i] }),
    getUniformLocation: (p: Program, name: string): Location => ({ program: p, name: name.replace('[0]', '') }),
    useProgram: (p: Program) => {
      program = p;
    },
    deleteProgram: () => {
      record.deleted.programs++;
    },
    createVertexArray: () => ({}),
    bindVertexArray: () => {},
    deleteVertexArray: () => {
      record.deleted.vertexArrays++;
    },
    createBuffer: () => ({}),
    bindBuffer: () => {},
    bufferData: () => {},
    deleteBuffer: () => {
      record.deleted.buffers++;
    },
    enableVertexAttribArray: () => {},
    vertexAttribPointer: () => {},
    getExtension: (name: string) => (halfFloat && name === 'EXT_color_buffer_half_float' ? {} : null),
    createTexture: () => ({}),
    bindTexture: () => {},
    texParameteri: () => {},
    texImage2D: (_target: number, _level: number, internalFormat: number) => {
      record.textureFormats.push(internalFormat);
    },
    deleteTexture: () => {
      record.deleted.textures++;
    },
    activeTexture: () => {},
    createFramebuffer: () => ({}),
    bindFramebuffer: (_target: number, fbo: unknown) => {
      framebuffer = fbo;
    },
    framebufferTexture2D: () => {},
    deleteFramebuffer: () => {
      record.deleted.framebuffers++;
    },
    viewport: (...args: number[]) => {
      record.viewports.push(args);
    },
    drawArrays: () => {
      record.draws.push(framebuffer);
    },
    uniform1f: (l: Location | null, v: number) => setUniform(l, v),
    uniform1i: (l: Location | null, v: number) => setUniform(l, v),
    uniform2f: (l: Location | null, a: number, b: number) => setUniform(l, [a, b]),
    uniform4f: (l: Location | null, a: number, b: number, c: number, d: number) => setUniform(l, [a, b, c, d]),
    uniform1fv: (l: Location | null, v: Float32Array) => setUniform(l, Array.from(v)),
    uniform4fv: (l: Location | null, v: Float32Array) => setUniform(l, Array.from(v)),
    get currentProgram() {
      return program;
    },
  };

  return { gl: gl as unknown as WebGL2RenderingContext, record, constants };
}

/** Makes `el.getBoundingClientRect()` report a fixed box */
export function setRect(el: Element, { left = 0, top = 0, width, height }: { left?: number; top?: number; width: number; height: number }) {
  el.getBoundingClientRect = () =>
    ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;
}
