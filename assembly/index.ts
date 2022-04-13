import { compile as compile_ } from "./compile"
import { BFRunner } from "./runner"
import { BFProgram } from "./types"
export { tokenize } from "./tokenize"

class BFRunnerI8 extends BFRunner<i8, Int8Array> {}

export function createRunnerI8(source: string, ms: i32): BFRunnerI8 {
  return new BFRunnerI8(compile_<i8>(source), ms)
}

type CellType = i32
type MemoryType = Int32Array

export function createRunner(source: string, ms: i32): BFRunner<CellType, MemoryType> {
  return new BFRunner<CellType, MemoryType>(compile_<CellType>(source), ms)
}

export function steps(runner: BFRunner<CellType, MemoryType>, ms: i32): i32 {
  return runner.steps(ms)
}
export function stepsTime(runner: BFRunner<CellType, MemoryType>, ms: i32): i32 {
  return runner.stepsTime(ms)
}
export function flushOutput(runner: BFRunner<CellType, MemoryType>): MemoryType | null {
  return runner.flushOutput()
}
export function getProgram(runner: BFRunner<CellType, MemoryType>): BFProgram<CellType> {
  return runner.program
}
export function getMemory(runner: BFRunner<CellType, MemoryType>): MemoryType {
  return runner.memory
}
export function getMp(runner: BFRunner<CellType, MemoryType>): i32 {
  return runner.mp
}
export function getIp(runner: BFRunner<CellType, MemoryType>): i32 {
  return runner.ip
}
export function input(runner: BFRunner<CellType, MemoryType>, input: MemoryType): void {
  runner.input(input)
}
export function setInputClosed(runner: BFRunner<CellType, MemoryType>): void {
  runner.inputClosed = true
}
