async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      "Date.now": (
        // ~lib/bindings/dom/Date.now() => f64
        Date.now
      ),
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    compile(source) {
      // assembly/index/compile(~lib/string/String) => assembly/types/BFProgram<u8>
      source = __lowerString(source) || __notnull();
      return __liftRecord3(exports.compile(source) >>> 0);
    },
    createRunner(source, memorySize) {
      // assembly/index/createRunner(~lib/string/String, i32) => assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>
      source = __lowerString(source) || __notnull();
      return __liftInternref(exports.createRunner(source, memorySize) >>> 0);
    },
    steps(runner, maxSteps) {
      // assembly/index/steps(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>, i32) => i32
      runner = __lowerInternref(runner) || __notnull();
      return exports.steps(runner, maxSteps);
    },
    stepsTime(runner, maxTime) {
      // assembly/index/stepsTime(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>, i32) => i32
      runner = __lowerInternref(runner) || __notnull();
      return exports.stepsTime(runner, maxTime);
    },
    flushOutput(runner) {
      // assembly/index/flushOutput(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>) => ~lib/typedarray/Uint8Array | null
      runner = __lowerInternref(runner) || __notnull();
      return __liftTypedArray(Uint8Array, exports.flushOutput(runner) >>> 0);
    },
    getProgram(runner) {
      // assembly/index/getProgram(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>) => assembly/types/BFProgram<u8>
      runner = __lowerInternref(runner) || __notnull();
      return __liftRecord3(exports.getProgram(runner) >>> 0);
    },
    getMemory(runner) {
      // assembly/index/getMemory(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>) => ~lib/typedarray/Uint8Array
      runner = __lowerInternref(runner) || __notnull();
      return __liftTypedArray(Uint8Array, exports.getMemory(runner) >>> 0);
    },
    getMp(runner) {
      // assembly/index/getMp(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>) => i32
      runner = __lowerInternref(runner) || __notnull();
      return exports.getMp(runner);
    },
    getIp(runner) {
      // assembly/index/getIp(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>) => i32
      runner = __lowerInternref(runner) || __notnull();
      return exports.getIp(runner);
    },
    input(runner, input) {
      // assembly/index/input(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>, ~lib/typedarray/Uint8Array) => void
      runner = __retain(__lowerInternref(runner) || __notnull());
      input = __lowerTypedArray(Uint8Array, 16, 0, input) || __notnull();
      try {
        exports.input(runner, input);
      } finally {
        __release(runner);
      }
    },
    setInputClosed(runner) {
      // assembly/index/setInputClosed(assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>) => void
      runner = __lowerInternref(runner) || __notnull();
      exports.setInputClosed(runner);
    },
    tokenize(source) {
      // assembly/tokenize/tokenize(~lib/string/String) => assembly/tokenize/BFTokenString
      source = __lowerString(source) || __notnull();
      return __liftRecord8(exports.tokenize(source) >>> 0);
    },
  }, exports);
  function __liftRecord4(pointer) {
    // assembly/types/Instruction<u8>
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      type: new Int32Array(memory.buffer)[pointer + 0 >>> 2],
      offset: new Int32Array(memory.buffer)[pointer + 4 >>> 2],
      offsets: __liftStaticArray(pointer => new Int32Array(memory.buffer)[pointer >>> 2], 2, new Uint32Array(memory.buffer)[pointer + 8 >>> 2]),
      deltas: __liftStaticArray(pointer => new Uint8Array(memory.buffer)[pointer >>> 0], 0, new Uint32Array(memory.buffer)[pointer + 12 >>> 2]),
      target: new Int32Array(memory.buffer)[pointer + 16 >>> 2],
    };
  }
  function __liftRecord3(pointer) {
    // assembly/types/BFProgram<u8>
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      length: new Int32Array(memory.buffer)[pointer + 0 >>> 2],
      instructions: __liftStaticArray(pointer => __liftRecord4(new Uint32Array(memory.buffer)[pointer >>> 2]), 2, new Uint32Array(memory.buffer)[pointer + 4 >>> 2]),
      sourceMap: __liftStaticArray(pointer => new Int32Array(memory.buffer)[pointer >>> 2], 2, new Uint32Array(memory.buffer)[pointer + 8 >>> 2]),
    };
  }
  function __liftRecord8(pointer) {
    // assembly/tokenize/BFTokenString
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      length: new Int32Array(memory.buffer)[pointer + 0 >>> 2],
      tokens: __liftStaticArray(pointer => new Int32Array(memory.buffer)[pointer >>> 2], 2, new Uint32Array(memory.buffer)[pointer + 4 >>> 2]),
      sourceMap: __liftStaticArray(pointer => new Int32Array(memory.buffer)[pointer >>> 2], 2, new Uint32Array(memory.buffer)[pointer + 8 >>> 2]),
    };
  }
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length,
      pointer = exports.__new(length << 1, 1) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    const memoryU32 = new Uint32Array(memory.buffer);
    return new constructor(
      memory.buffer,
      memoryU32[pointer + 4 >>> 2],
      memoryU32[pointer + 8 >>> 2] / constructor.BYTES_PER_ELEMENT
    ).slice();
  }
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 0)) >>> 0,
      header = exports.__new(12, id) >>> 0,
      memoryU32 = new Uint32Array(memory.buffer);
    memoryU32[header + 0 >>> 2] = buffer;
    memoryU32[header + 4 >>> 2] = buffer;
    memoryU32[header + 8 >>> 2] = length << align;
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  function __liftStaticArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      length = new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> align,
      values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(pointer + (i << align >>> 0));
    return values;
  }
  const registry = new FinalizationRegistry(__release);
  class Internref extends Number {}
  function __liftInternref(pointer) {
    if (!pointer) return null;
    const sentinel = new Internref(__retain(pointer));
    registry.register(sentinel, pointer);
    return sentinel;
  }
  function __lowerInternref(value) {
    if (value == null) return 0;
    if (value instanceof Internref) return value.valueOf();
    throw TypeError("internref expected");
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  return adaptedExports;
}
export const {
  compile,
  createRunner,
  steps,
  stepsTime,
  flushOutput,
  getProgram,
  getMemory,
  getMp,
  getIp,
  input,
  setInputClosed,
  tokenize
} = await (async url => instantiate(
  await (
    typeof globalThis.fetch === "function"
      ? WebAssembly.compileStreaming(globalThis.fetch(url))
      : WebAssembly.compile(await (await import("node:fs/promises")).readFile(url))
  ), {
  }
))(new URL("release.wasm", import.meta.url));
