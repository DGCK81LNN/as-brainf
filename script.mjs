import * as ASBrainf from "./build/release.js"
window.ASBrainf = ASBrainf

try {
if (navigator.platform.match(/^iP|^Mac/))
  document.querySelector("meta[name=viewport]").content += ", user-scalable=no"
} catch(_) {}

const $code = document.getElementById("codebox")
const $text = document.getElementById("text")
const $btn = document.getElementById("btn")
const $out = document.getElementById("out")

$btn.onclick = () => {
  console.time("compile")
  let runner = window.ASBrainfRunner = ASBrainf.createRunner($code.value, 3000)
  console.timeEnd("compile")
  console.log("runner", runner)
  console.log("program", ASBrainf.getProgram(runner))

  const input = new TextEncoder().encode($text.value)
  console.log("input", input)
  ASBrainf.input(runner, input)
  ASBrainf.setInputClosed(runner)

  let msg
  console.time("run")
  while ((msg = ASBrainf.stepsTime(runner, 10000)) === 0) { }
  console.timeEnd("run")

  if (msg === 0) alert("Timeout")
  else if (msg === 1) alert("Error: pointer overflow")
  else if (msg === 2) alert("Error: dead simple loop")
  else if (msg === 3) alert("Error: unknown internal error")

  console.log("ip", ASBrainf.getIp(runner))
  console.log("memory", ASBrainf.getMemory(runner))
  console.log("mp", ASBrainf.getMp(runner))

  let out = ASBrainf.flushOutput(runner)
  console.log("output", out)
  $out.value = out ? new TextDecoder().decode(out) : ""
}
