import { WhistleProgram } from "https://raw.githubusercontent.com/whistle-lang/runtime/main/deno/mod.ts";
import LLVM from "../mod.ts";

const binary = await Deno.readFile(Deno.args[0]);
const module = await WebAssembly.compile(binary);

const program = new WhistleProgram(module);
program.add("llvm", LLVM);
await program.run();