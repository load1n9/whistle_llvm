# whistle_llvm

## llvm c interface for whistle based on [llvm-deno](https://github.com/littledivy/llvm-deno)

## Usage

### main.whi

```rs
import "https://raw.githubusercontent.com/load1n9/whistle_llvm/main/llvm.whi"

export fn main() {
    var context: i64 = LLVMContextCreate()
    var module: i64 = LLVMModuleCreateWithNameInContext(context, "whistle_llvm\0")
    var builder: i64 = LLVMCreateBuilderInContext(context)

    var i64t: i64 = LLVMInt64TypeInContext(context)
    var func_type: i64 = LLVMFunctionType(LLVMInt32Type(), 0, 0)
    var func: i64 = LLVMAddFunction(module, "main\0", func_type)
    var test: i64 = 0
    LLVMSetFunctionCallConv(func, test)
    var entry: i64 = LLVMAppendBasicBlockInContext(context, func, "entry\0")
    LLVMPositionBuilderAtEnd(builder, entry)
    var sum: i64 = LLVMBuildAdd(builder, LLVMConstInt(i64t, 1, 0), LLVMConstInt(i64t, 2, 0), "sum\0")
    LLVMBuildRet(builder, sum)
    LLVMDumpModule(module)
    LLVMShutdown()
}
```

### compile the whistle file

```sh
whistle compile main.whi -o main.wasm
```

### main.ts
```ts
import { WhistleProgram } from "https://raw.githubusercontent.com/whistle-lang/runtime/main/deno/mod.ts";
import LLVM from "../mod.ts";

const binary = await Deno.readFile("main.wasm");
const module = await WebAssembly.compile(binary);

const program = new WhistleProgram(module);
program.add("llvm", LLVM);
await program.run();
```

### run 
```sh
deno run -A --unstable main.ts
```

### output
```
; ModuleID = 'whistle_llvm'
source_filename = "whistle_llvm"

define i32 @main() {
entry:
  ret i64 3
}
```

