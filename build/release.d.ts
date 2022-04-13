/**
 * assembly/index/compile
 * @param source `~lib/string/String`
 * @returns `assembly/types/BFProgram<u8>`
 */
export declare function compile(source: string): __Record3<never>;
/**
 * assembly/index/createRunner
 * @param source `~lib/string/String`
 * @param memorySize `i32`
 * @returns `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 */
export declare function createRunner(source: string, memorySize: number): __Internref17;
/**
 * assembly/index/steps
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @param maxSteps `i32`
 * @returns `i32`
 */
export declare function steps(runner: __Internref17, maxSteps: number): number;
/**
 * assembly/index/stepsTime
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @param maxTime `i32`
 * @returns `i32`
 */
export declare function stepsTime(runner: __Internref17, maxTime: number): number;
/**
 * assembly/index/flushOutput
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @returns `~lib/typedarray/Uint8Array | null`
 */
export declare function flushOutput(runner: __Internref17): Uint8Array | null;
/**
 * assembly/index/getProgram
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @returns `assembly/types/BFProgram<u8>`
 */
export declare function getProgram(runner: __Internref17): __Record3<never>;
/**
 * assembly/index/getMemory
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @returns `~lib/typedarray/Uint8Array`
 */
export declare function getMemory(runner: __Internref17): Uint8Array;
/**
 * assembly/index/getMp
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @returns `i32`
 */
export declare function getMp(runner: __Internref17): number;
/**
 * assembly/index/getIp
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @returns `i32`
 */
export declare function getIp(runner: __Internref17): number;
/**
 * assembly/index/input
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 * @param input `~lib/typedarray/Uint8Array`
 */
export declare function input(runner: __Internref17, input: Uint8Array): void;
/**
 * assembly/index/setInputClosed
 * @param runner `assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array>`
 */
export declare function setInputClosed(runner: __Internref17): void;
/**
 * assembly/tokenize/tokenize
 * @param source `~lib/string/String`
 * @returns `assembly/tokenize/BFTokenString`
 */
export declare function tokenize(source: string): __Record8<never>;
/** assembly/types/Instruction<u8> */
declare interface __Record4<TOmittable> {
  /** @type `i32` */
  type: number | TOmittable;
  /** @type `i32` */
  offset: number | TOmittable;
  /** @type `~lib/staticarray/StaticArray<i32> | null` */
  offsets: Array<number> | null | TOmittable;
  /** @type `~lib/staticarray/StaticArray<u8> | null` */
  deltas: Array<number> | null | TOmittable;
  /** @type `i32` */
  target: number | TOmittable;
}
/** assembly/types/BFProgram<u8> */
declare interface __Record3<TOmittable> {
  /** @type `i32` */
  length: number | TOmittable;
  /** @type `~lib/staticarray/StaticArray<assembly/types/Instruction<u8>>` */
  instructions: Array<__Record4<never>>;
  /** @type `~lib/staticarray/StaticArray<i32> | null` */
  sourceMap: Array<number> | null | TOmittable;
}
/** assembly/runner/BFRunner<u8,~lib/typedarray/Uint8Array> */
declare class __Internref17 extends Number {
  private __nominal17: symbol;
}
/** assembly/tokenize/BFTokenString */
declare interface __Record8<TOmittable> {
  /** @type `i32` */
  length: number | TOmittable;
  /** @type `~lib/staticarray/StaticArray<i32>` */
  tokens: Array<number>;
  /** @type `~lib/staticarray/StaticArray<i32>` */
  sourceMap: Array<number>;
}
