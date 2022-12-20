// deno-lint-ignore-file no-explicit-any prefer-const
import LLVM from "./core.ts";

const encode = (value: string) => new TextEncoder().encode(value);
const readString = (
  ptr: any,
  mem: any,
) => {
  const view = new Uint8Array(mem.buffer);
  let end = ptr;
  while (view[end]) ++end;
  return (new TextDecoder()).decode(new Uint8Array(view.subarray(ptr, end)));
};

let memory: any;

const binary = await Deno.readFile(Deno.args[0]);
const module = await WebAssembly.compile(binary);
const instance: any = await WebAssembly.instantiate(module, {
  llvm: {
    LLVMContextCreate() {
      return BigInt(LLVM.symbols.LLVMContextCreate());
    },
    LLVMModuleCreateWithNameInContext(ctx: bigint, content: number) {
      const cstr = readString(content, memory)!;
      return BigInt(LLVM.symbols.LLVMModuleCreateWithNameInContext(
        encode(cstr),
        ctx,
      ));
    },
    LLVMCreateBuilderInContext(ctx: bigint) {
      return BigInt(LLVM.symbols.LLVMCreateBuilderInContext(ctx));
    },
    LLVMAddFunction(module: bigint, content: number, type: bigint) {
      return BigInt(
        LLVM.symbols.LLVMAddFunction(
          module,
          encode(readString(content, memory)),
          type,
        ),
      );
    },
    LLVMAppendBasicBlockInContext(
      context: bigint,
      func: bigint,
      content: number,
    ) {
      return BigInt(LLVM.symbols.LLVMAppendBasicBlockInContext(
        context,
        func,
        encode(readString(content, memory)),
      ));
    },
    LLVMPositionBuilderAtEnd(builder: bigint, block: bigint) {
      LLVM.symbols.LLVMPositionBuilderAtEnd(builder, block);
    },
    LLVMBuildAdd(builder: bigint, arg2: bigint, arg3: bigint, content: number) {
      return BigInt(
        LLVM.symbols.LLVMBuildAdd(
          builder,
          arg2,
          arg3,
          encode(readString(content, memory)),
        ),
      );
    },
    LLVMInt1TypeInContext(ctx: bigint) {
      return BigInt(LLVM.symbols.LLVMInt1TypeInContext(ctx));
    },
    LLVMInt8TypeInContext(ctx: bigint) {
      return BigInt(LLVM.symbols.LLVMInt8TypeInContext(ctx));
    },
    LLVMInt16TypeInContext(ctx: bigint) {
      return BigInt(LLVM.symbols.LLVMInt16TypeInContext(ctx));
    },
    LLVMInt32TypeInContext(ctx: bigint) {
      return BigInt(LLVM.symbols.LLVMInt32TypeInContext(ctx));
    },
    LLVMInt64TypeInContext(ctx: bigint) {
      return BigInt(LLVM.symbols.LLVMInt64TypeInContext(ctx));
    },
    LLVMPointerType(_type: bigint, arg: number) {
      return BigInt(LLVM.symbols.LLVMPointerType(_type, arg));
    },
    LLVMFunctionType(type: bigint, length: number, a2: number) {
      const argts: bigint[] = [];
      for (let i = 0; i < length; i++) {
        argts.push(BigInt(type))
      }
      return BigInt(LLVM.symbols.LLVMFunctionType(
        type,
        Deno.UnsafePointer.of(BigUint64Array.of(...argts)),
        length,
        a2,
      ));
    },
    LLVMConstInt(type: bigint, arg1: number, arg2: number) {
      return BigInt(LLVM.symbols.LLVMConstInt(type, arg1, arg2));
    },
    LLVMInt1Type() {
      return BigInt(LLVM.symbols.LLVMInt1Type());
    },
    LLVMInt8Type() {
      return BigInt(LLVM.symbols.LLVMInt8Type());
    },
    LLVMInt16Type() {
      return BigInt(LLVM.symbols.LLVMInt16Type());
    },
    LLVMInt32Type() {
      return BigInt(LLVM.symbols.LLVMInt32Type());
    },
    LLVMInt64Type() {
      return BigInt(LLVM.symbols.LLVMInt64Type());
    },
    LLVMInt128Type(arg: number) {
      return BigInt(LLVM.symbols.LLVMInt128Type(arg));
    },
    LLVMBuildRet(builder: bigint, sum: bigint) {
      LLVM.symbols.LLVMBuildRet(builder, sum);
    },
    LLVMDumpModule(module: bigint) {
      LLVM.symbols.LLVMDumpModule(module);
    },
    LLVMShutdown() {
      LLVM.symbols.LLVMShutdown();
    },
    LLVMSetFunctionCallConv(func: bigint, value: bigint) {
      LLVM.symbols.LLVMSetFunctionCallConv(func, value);
    },
    LLVMGetParam(func: bigint, value: number) {
      return BigInt(LLVM.symbols.LLVMGetParam(func, value));
    },
  },
});

memory = instance.exports.memory;
instance.exports._start();