export { tokenize } from "./tokenize"
import { compile as compile_ } from "./compile"
import { BFRunner } from "./runner"
import { BFProgram } from "./types"

type CellType = u8
type MemoryType = Uint8Array

export function compile(source: string): BFProgram<CellType> {
  return compile_<CellType>(source)
}

export function createRunner(source: string, memorySize: i32): BFRunner<CellType, MemoryType> {
  return new BFRunner<CellType, MemoryType>(compile(source), memorySize)
}

export function steps(runner: BFRunner<CellType, MemoryType>, maxSteps: i32): i32 {
  return runner.steps(maxSteps)
}
export function stepsTime(runner: BFRunner<CellType, MemoryType>, maxTime: i32): i32 {
  return runner.stepsTime(maxTime)
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
