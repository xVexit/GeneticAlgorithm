export type Context = WebGL2RenderingContext;
export type Shader = WebGLShader;
export type Program = WebGLProgram;
export type Buffer = WebGLBuffer;
export type VertexArray = WebGLVertexArrayObject;
export type Texture = WebGLTexture;
export type Framebuffer = WebGLFramebuffer;
export type UniformLocation = WebGLUniformLocation;

export type ResourceWithDeleteFunction<T> = [T, () => void];

/**
 * Enumeration representing data types supported by WebGL.
 * @enum {number} DataType
 */
export const enum DataType {
  BYTE = 0x1400,
  UNSIGNED_BYTE = 0x1401,
  SHORT = 0x1402,
  UNSIGNED_SHORT = 0x1403,
  INT = 0x1404,
  UNSIGNED_INT = 0x1405,
  FLOAT = 0x1406,
}

export const BYTE = DataType.BYTE;
export const UNSIGNED_BYTE = DataType.UNSIGNED_BYTE;
export const SHORT = DataType.SHORT;
export const UNSIGNED_SHORT = DataType.UNSIGNED_SHORT;
export const INT = DataType.INT;
export const UNSIGNED_INT = DataType.UNSIGNED_INT;
export const FLOAT = DataType.FLOAT;

/**
 * Enumeration representing pixel formats supported by WebGL.
 * @enum {number} PixelFormat
 */
export const enum PixelFormat {
  RGB = 0x1907,
  RGBA = 0x1908,
}

export const RGB = PixelFormat.RGB;
export const RGBA = PixelFormat.RGBA;

/**
 * Enumeration representing texture filters supported by WebGL.
 * @enum {number} UniformType
 */
export const enum TextureFilter {
  NEAREST = 0x2600,
  LINEAR = 0x2601,
  NEAREST_MIPMAP_NEAREST = 0x2700,
  LINEAR_MIPMAP_NEAREST = 0x2701,
  NEAREST_MIPMAP_LINEAR = 0x2702,
  LINEAR_MIPMAP_LINEAR = 0x2703,
}

export const NEAREST = TextureFilter.NEAREST;
export const LINEAR = TextureFilter.LINEAR;
export const NEAREST_MIPMAP_NEAREST = TextureFilter.NEAREST_MIPMAP_NEAREST;
export const LINEAR_MIPMAP_NEAREST = TextureFilter.LINEAR_MIPMAP_NEAREST;
export const NEAREST_MIPMAP_LINEAR = TextureFilter.NEAREST_MIPMAP_LINEAR;
export const LINEAR_MIPMAP_LINEAR = TextureFilter.LINEAR_MIPMAP_LINEAR;

/**
 * Enumeration representing buffer types supported by WebGL.
 * @enum {number} BufferType
 */
export const enum BufferType {
  ARRAY_BUFFER = 0x8892,
  ELEMENT_ARRAY_BUFFER = 0x8893,
}

export const ARRAY_BUFFER = BufferType.ARRAY_BUFFER;
export const ELEMENT_ARRAY_BUFFER = BufferType.ELEMENT_ARRAY_BUFFER;

/**
 * Enumeration representing buffer usage patterns in WebGL.
 * @enum {number} BufferUsage
 */
export const enum BufferUsage {
  STREAM_DRAW = 0x88E0,
  STATIC_DRAW = 0x88E4,
  DYNAMIC_DRAW = 0x88E8,
}

export const STREAM_DRAW = BufferUsage.STREAM_DRAW;
export const STATIC_DRAW = BufferUsage.STATIC_DRAW;
export const DYNAMIC_DRAW = BufferUsage.DYNAMIC_DRAW;

/**
 * Enumeration representing shader types supported by WebGL.
 * @enum {number} ShaderType
 */
export const enum ShaderType {
  FRAGMENT_SHADER = 0x8B30,
  VERTEX_SHADER = 0x8B31,
}

export const VERTEX_SHADER = ShaderType.VERTEX_SHADER;
export const FRAGMENT_SHADER = ShaderType.FRAGMENT_SHADER;

/**
 * Enumeration representing uniform types supported by WebGL.
 * @enum {number} UniformType
 */
export const enum UniformType {
  UNIFORM_INT,
  UNIFORM_FLOAT,
  UNIFORM_INT2,
  UNIFORM_FLOAT2,
  UNIFORM_INT3,
  UNIFORM_FLOAT3,
  UNIFORM_INT4,
  UNIFORM_FLOAT4,
}

export const UNIFORM_INT = UniformType.UNIFORM_INT;
export const UNIFORM_FLOAT = UniformType.UNIFORM_FLOAT;
export const UNIFORM_INT2 = UniformType.UNIFORM_INT2;
export const UNIFORM_FLOAT2 = UniformType.UNIFORM_FLOAT2;
export const UNIFORM_INT3 = UniformType.UNIFORM_INT3;
export const UNIFORM_FLOAT3 = UniformType.UNIFORM_FLOAT3;
export const UNIFORM_INT4 = UniformType.UNIFORM_INT4;
export const UNIFORM_FLOAT4 = UniformType.UNIFORM_FLOAT4;

/**
 * Creates and compiles a WebGL shader, then returns it with a delete function.
 *
 * @param context - The WebGL context in which to create the shader.
 * @param type - The WebGL shader type.
 * @param source - The shader source code in GLSL.
 *
 * @throws When is unable to create or compile the WebGL shader.
 * @returns {ResourceWithDeleteFunction<Shader>} The shader with the delete function.
 */
export function createShader(
  context: Context,
  type: ShaderType,
  source: string,
): ResourceWithDeleteFunction<Shader> {
  const shader: Shader | null = context.createShader(type);
  if (!shader) {
    throw new Error("Unable to create WebGL shader!");
  }

  context.shaderSource(shader, source);
  context.compileShader(shader);

  if (context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    return [shader, () => context.deleteShader(shader)];
  } else {
    throw new Error(
      `Failed to compile a shader: ${context.getShaderInfoLog(shader)}`,
    );
  }
}

/**
 * Creates and links a WebGL program, then returns it with a delete function.
 *
 * @param context - The WebGL context in which to create the program.
 * @param shaders - The WebGL shaders to attach.
 *
 * @throws When is unable to create or link the WebGL program.
 * @returns {ResourceWithDeleteFunction<Program>} The program with the delete function.
 */
export function createProgram(
  context: Context,
  shaders: Shader[],
): ResourceWithDeleteFunction<Program> {
  const program: Program | null = context.createProgram();
  if (!program) {
    throw new Error("Unable to create WebGL program!");
  }

  shaders.forEach((shader) => context.attachShader(program, shader));
  context.linkProgram(program);
  shaders.forEach((shader) => context.detachShader(program, shader));

  if (context.getProgramParameter(program, context.LINK_STATUS)) {
    return [program, () => context.deleteProgram(program)];
  } else {
    throw new Error(
      `Failed to link a program: ${context.getProgramInfoLog(program)}`,
    );
  }
}

/**
 * Creates and allocates a WebGL buffer, then returns it with a delete function.
 *
 * @param context - The WebGL context in which to create the buffer.
 * @param data - The buffer data or buffer size.
 * @param options - The WebGL buffer options:
 *
 * - type: The WebGL buffer type (default: ARRAY_BUFFER).
 * - usage: The WebGL buffer usage (default: STATIC_DRAW).
 *
 * @throws When is unable to create the WebGL buffer.
 * @returns {ResourceWithDeleteFunction<Buffer>} The buffer with the delete function.
 */
export function createBuffer(
  context: Context,
  data: ArrayBufferView | number,
  options: {
    type?: BufferType;
    usage?: BufferUsage;
  } = {},
): ResourceWithDeleteFunction<Buffer> {
  const buffer: Buffer | null = context.createBuffer();
  if (!buffer) {
    throw new Error("Unable to create WebGL buffer!");
  }

  context.bindBuffer(options.type || ARRAY_BUFFER, buffer);
  switch (typeof data) {
    case "number":
      context.bufferData(
        options.type || ARRAY_BUFFER,
        data,
        options.usage || STATIC_DRAW,
      );
      break;
    default:
      context.bufferData(
        options.type || ARRAY_BUFFER,
        data,
        options.usage || STATIC_DRAW,
      );
      break;
  }

  return [buffer, () => context.deleteBuffer(buffer)];
}

/**
 * Creates a WebGL vertex array with specified attributes, then returns it with a delete function.
 *
 * @param context - The WebGL context in which to create the vertex array.
 * @param attributes - The WebGL vertex array attributes:
 *
 * - index: The WebGL attribute position in the vertex shader.
 * - size: The number of elements.
 * - buffer: The WebGL buffer with elements.
 * - type: The WebGL element type (default: FLOAT).
 * - stride: The offset between vertices in bytes (default: 0).
 * - offset: The offset between attributes in bytes (default: 0).
 * - normalized: The WebGL integer normalization enabled (default: false).
 *
 * @throws When is unable to create the WebGL vertex array.
 * @returns {ResourceWithDeleteFunction<VertexArray>} The vertex array with the delete function.
 */
export function createVertexArray(
  context: Context,
  attributes: {
    index: number;
    size: number;
    buffer: Buffer;
    type?: DataType;
    stride?: number;
    offset?: number;
    normalized?: boolean;
  }[],
): ResourceWithDeleteFunction<VertexArray> {
  const vertexArray: VertexArray | null = context.createVertexArray();
  if (!vertexArray) {
    throw new Error("Unable to create WebGL vertex array!");
  }

  context.bindVertexArray(vertexArray);
  attributes.forEach(
    (attribute) => {
      context.enableVertexAttribArray(attribute.index);
      context.bindBuffer(context.ARRAY_BUFFER, attribute.buffer);
      context.vertexAttribPointer(
        attribute.index,
        attribute.size,
        attribute.type || FLOAT,
        attribute.normalized || false,
        attribute.stride || 0,
        attribute.offset || 0,
      );
    },
  );

  return [vertexArray, () => context.deleteVertexArray(vertexArray)];
}

/**
 * Creates a WebGL texture with specified properties, then returns it with a delete function.
 *
 * @param context - The WebGL context in which to create the texture.
 * @param width - The texture width in pixels.
 * @param height - The texture height in pixels.
 * @param options - The WebGL texture options:
 *
 * - format: The WebGL texture format (default: RGBA).
 * - type: The WebGL texture type (default: UNSIGNED_BYTE).
 * - level: The WebGL texture level (default: 0).
 * - border: The WebGL texture border (default: 0).
 * - pixels: The texture pixels array to import (default: null).
 * - filters: The WebGL texture filters options.
 *
 * @throws When is unable to create the WebGL texture.
 * @returns {ResourceWithDeleteFunction<Texture>} The texture with the delete function.
 */
export function createTexture(
  context: Context,
  width: number,
  height: number,
  options: {
    format?: PixelFormat;
    type?: DataType;
    level?: number;
    border?: number;
    pixels?: ArrayBufferView;
    filters?: {
      minifying?: TextureFilter;
      magnifying?: TextureFilter;
    };
  } = {},
): ResourceWithDeleteFunction<Texture> {
  const texture: Texture | null = context.createTexture();
  if (!texture) {
    throw new Error("Unable to create WebGL texture!");
  }

  context.bindTexture(context.TEXTURE_2D, texture);
  context.texImage2D(
    context.TEXTURE_2D,
    options.level || 0,
    options.format || RGBA,
    width,
    height,
    options.border || 0,
    options.format || RGBA,
    options.type || UNSIGNED_BYTE,
    options.pixels || null,
  );

  if (options.filters) {
    const { minifying, magnifying } = options.filters;
    if (minifying) {
      context.texParameteri(
        context.TEXTURE_2D,
        context.TEXTURE_MIN_FILTER,
        minifying,
      );
    }
    if (magnifying) {
      context.texParameteri(
        context.TEXTURE_2D,
        context.TEXTURE_MAG_FILTER,
        magnifying,
      );
    }
  }

  return [texture, () => context.deleteTexture(texture)];
}

/**
 * Creates a WebGL framebuffer with specified color attachments, then returns it with a delete function.
 *
 * @param context - The WebGL context in which to create the framebuffer.
 * @param attachments - The WebGL framebuffer attachments:
 *
 * - index: The WebGL color attachment index.
 * - texture: The WebGL color attachment texture.
 * - level: The WebGL color attachment level (default: 0).
 *
 * @throws When is unable to create the WebGL framebuffer.
 * @returns {ResourceWithDeleteFunction<Framebuffer>} The framebuffer with the delete function.
 */
export function createFramebuffer(
  context: Context,
  attachments: {
    index: number;
    texture: Texture;
    level?: number;
  }[],
): ResourceWithDeleteFunction<Framebuffer> {
  const framebuffer: Framebuffer = context.createFramebuffer()!;
  if (!framebuffer) {
    throw new Error("Unable to create WebGL framebuffer!");
  }

  context.bindFramebuffer(context.FRAMEBUFFER, framebuffer);
  attachments.forEach(
    (attachment) => {
      context.framebufferTexture2D(
        context.FRAMEBUFFER,
        context.COLOR_ATTACHMENT0 + attachment.index,
        context.TEXTURE_2D,
        attachment.texture,
        attachment.level || 0,
      );
    },
  );

  return [framebuffer, () => context.deleteFramebuffer(framebuffer)];
}

/**
 * Selects a WebGL uniform location from the specified WebGL program.
 *
 * @param context - The WebGL context.
 * @param program - The WebGL program.
 * @param uniform - The uniform variable name.
 *
 * @throws When is unable to select the uniform location.
 * @returns UniformLocation The uniform location from the specified WebGL program.
 */
export function selectUniform(
  context: Context,
  program: Program,
  uniform: string,
): UniformLocation {
  const uniformLocation: UniformLocation | null = context
    .getUniformLocation(program, uniform);
  if (uniformLocation) {
    return uniformLocation;
  } else {
    throw new Error(`Failed to select a uniform: ${uniform}`);
  }
}

/**
 * Selects an array of pixels from the specified WebGL framebuffer.
 *
 * @param context - The WebGL context.
 * @param framebuffer - The WebGL framebuffer.
 * @param width - The width of the region.
 * @param height - The height of the region.
 * @param options - The WebGL reading options:
 *
 * - type: The WebGL texture type (default: UNSIGNED_BYTE).
 * - format: The WebGL texture format (default: RGBA).
 * - offset: The offset of the region (default: {x: 0, y: 0}).
 *
 * @returns {Uint8Array} An array of pixels from the specified WebGL framebuffer.
 */
export function selectPixels(
  context: Context,
  framebuffer: Framebuffer,
  width: number,
  height: number,
  options: {
    type?: DataType;
    format?: PixelFormat;
    offset?: {
      x: number;
      y: number;
    };
  } = {},
): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);

  context.bindFramebuffer(context.FRAMEBUFFER, framebuffer);
  context.readPixels(
    options.offset?.x || 0,
    options.offset?.y || 0,
    width,
    height,
    options.format || RGBA,
    options.type || UNSIGNED_BYTE,
    pixels,
  );

  return pixels;
}

/**
 * Updates a WebGL buffer contents with specified data.
 *
 * @param context - The WebGL context used for copying.
 * @param buffer - The WebGL buffer.
 * @param data - The buffer data.
 * @param options - The WebGL buffer options:
 *
 * - type: The WebGL buffer type. (default: ARRAY_BUFFER)
 * - offset: The WebGL buffer starting offset. (default: 0)
 */
export function updateBuffer(
  context: Context,
  buffer: Buffer,
  data: ArrayBufferView,
  options: {
    type?: BufferType;
    offset?: number;
  } = {},
): void {
  context.bindBuffer(options.type || ARRAY_BUFFER, buffer);
  context.bufferSubData(
    options.type || ARRAY_BUFFER,
    options.offset || 0,
    data,
  );
}

/**
 * Draws the vertices using the specified WebGL program and WebGL vertex array.
 *
 * @param context - The WebGL context used for drawing.
 * @param program - The WebGL program used for drawing.
 * @param vertexArray - The WebGL vertex array used of drawing.
 * @param vertices - The number of vertices.
 * @param options - The WebGL drawing options:
 *
 * - framebuffer: The WebGL framebuffer used for drawing (default: null).
 * - viewport: The viewport dimensions (default: [0, 0, canvas.width, canvas.height]).
 * - clear: The WebGL framebuffer clear options.
 * - textures: The WebGL textures with specified units.
 * - uniforms: The WebGL uniforms with specified values and locations.
 */
export function drawArrays(
  context: Context,
  program: Program,
  vertexArray: VertexArray,
  vertices: number,
  options: {
    framebuffer?: Framebuffer;
    viewport?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    clear?: {
      color?: {
        r: number;
        g: number;
        b: number;
        a: number;
      };
      depth?: number;
    };
    textures?: {
      unit: number;
      texture: Texture;
    }[];
    uniforms?: {
      location: UniformLocation;
      type: UniformType;
      value: {
        x?: number;
        y?: number;
        z?: number;
        w?: number;
      };
    }[];
  } = {},
): void {
  context.bindFramebuffer(context.FRAMEBUFFER, options.framebuffer || null);
  context.useProgram(program);
  context.bindVertexArray(vertexArray);

  checkViewportOptions(context, options.viewport);
  checkClearOptions(context, options.clear);
  checkTexturesOptions(context, options.textures);
  checkUniformsOptions(context, options.uniforms);

  context.drawArrays(context.TRIANGLES, 0, vertices);
}

function checkViewportOptions(
  context: Context,
  viewport?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  },
): void {
  if (viewport) {
    context.viewport(
      viewport.x || 0,
      viewport.y || 0,
      viewport.width || context.canvas.width,
      viewport.height || context.canvas.height,
    );
  }
}

function checkTexturesOptions(
  context: Context,
  textures?: {
    unit: number;
    texture: Texture;
  }[],
): void {
  if (textures) {
    textures.forEach(
      ({ unit, texture }) => {
        context.activeTexture(context.TEXTURE0 + unit);
        context.bindTexture(
          context.TEXTURE_2D,
          texture,
        );
      },
    );
  }
}

function checkClearOptions(
  context: Context,
  clear?: {
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    depth?: number;
  },
): void {
  if (clear) {
    const { color, depth } = clear;
    if (color) {
      context.clearColor(color.r, color.g, color.b, color.a);
    }
    if (depth) {
      context.clearDepth(depth);
    }
    context.clear(
      (clear.color ? context.COLOR_BUFFER_BIT : 0) |
        (clear.depth ? context.DEPTH_BUFFER_BIT : 0),
    );
  }
}

function checkUniformsOptions(
  context: Context,
  uniforms?: {
    location: UniformLocation;
    type: UniformType;
    value: {
      x?: number;
      y?: number;
      z?: number;
      w?: number;
    };
  }[],
): void {
  if (uniforms) {
    uniforms.forEach(({ location, type, value }) => {
      switch (type) {
        case UniformType.UNIFORM_INT:
          context.uniform1i(
            location,
            value.x || 0,
          );
          break;
        case UniformType.UNIFORM_FLOAT:
          context.uniform1f(
            location,
            value.x || 0,
          );
          break;
        case UniformType.UNIFORM_INT2:
          context.uniform2i(
            location,
            value.x || 0,
            value.y || 0,
          );
          break;
        case UniformType.UNIFORM_FLOAT2:
          context.uniform2f(
            location,
            value.x || 0,
            value.y || 0,
          );
          break;
        case UniformType.UNIFORM_INT3:
          context.uniform3i(
            location,
            value.x || 0,
            value.y || 0,
            value.z || 0,
          );
          break;
        case UniformType.UNIFORM_FLOAT3:
          context.uniform3f(
            location,
            value.x || 0,
            value.y || 0,
            value.z || 0,
          );
          break;
        case UniformType.UNIFORM_INT4:
          context.uniform4i(
            location,
            value.x || 0,
            value.y || 0,
            value.z || 0,
            value.w || 0,
          );
          break;
        case UniformType.UNIFORM_FLOAT4:
          context.uniform4f(
            location,
            value.x || 0,
            value.y || 0,
            value.z || 0,
            value.w || 0,
          );
          break;
        default:
          break;
      }
    });
  }
}
