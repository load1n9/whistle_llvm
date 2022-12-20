import { WhistleStorage } from "https://raw.githubusercontent.com/whistle-lang/runtime/main/deno/mod.ts";
import { encode, readString } from "./util.ts";

const SYMBOLS = {
  // Core
  "LLVMShutdown": {
    parameters: [],
    result: "void",
  },
  "LLVMCreateMessage": {
    parameters: ["buffer"],
    result: "buffer",
  },
  "LLVMDisposeMessage": {
    parameters: ["buffer"],
    result: "void",
  },

  // Core -> Contexts
  "LLVMContextCreate": {
    parameters: [],
    result: "pointer",
  },
  "LLVMGetGlobalContext": {
    parameters: [],
    result: "pointer",
  },
  "LLVMContextDispose": {
    parameters: ["pointer"],
    result: "void",
  },

  // Core -> Modules
  "LLVMModuleCreateWithName": {
    parameters: ["buffer"],
    result: "pointer",
  },
  "LLVMModuleCreateWithNameInContext": {
    parameters: ["buffer", "pointer"],
    result: "pointer",
  },
  // Core -> Types
  "LLVMInt1TypeInContext": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMInt8TypeInContext": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMInt16TypeInContext": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMInt32TypeInContext": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMInt64TypeInContext": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMInt128TypeInContext": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMIntTypeInContext": {
    parameters: ["pointer", "i32"],
    result: "pointer",
  },
  "LLVMInt1Type": {
    parameters: [],
    result: "pointer",
  },
  "LLVMInt8Type": {
    parameters: [],
    result: "pointer",
  },
  "LLVMInt16Type": {
    parameters: [],
    result: "pointer",
  },
  "LLVMInt32Type": {
    parameters: [],
    result: "pointer",
  },
  "LLVMInt64Type": {
    parameters: [],
    result: "pointer",
  },
  "LLVMInt128Type": {
    parameters: ["i32"],
    result: "pointer",
  },
  "LLVMPointerType": {
    parameters: ["pointer", "i32"],
    result: "pointer",
  },

  // Core -> Types -> Function
  "LLVMFunctionType": {
    parameters: ["pointer", "pointer", "i32", "i32"],
    result: "pointer",
  },

  // Core -> Modules
  "LLVMAddFunction": {
    parameters: ["pointer", "buffer", "pointer"],
    result: "pointer",
  },

  // Core -> Instruction Builders
  "LLVMCreateBuilder": {
    parameters: [],
    result: "pointer",
  },
  "LLVMCreateBuilderInContext": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMDisposeBuilder": {
    parameters: ["pointer"],
    result: "void",
  },
  "LLVMPositionBuilderAtEnd": {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  "LLVMBuildRetVoid": {
    parameters: ["pointer"],
    result: "pointer",
  },
  "LLVMBuildRet": {
    parameters: ["pointer", "pointer"],
    result: "pointer",
  },
  "LLVMDumpModule": {
    parameters: ["pointer"],
    result: "void",
  },
  "LLVMBuildAdd": {
    parameters: ["pointer", "pointer", "pointer", "buffer"],
    result: "pointer",
  },

  // Core->Values->Constants->Scalar
  "LLVMConstInt": {
    parameters: ["pointer", "i64", "i32"],
    result: "pointer",
  },

  // Core -> Basic Block
  "LLVMAppendBasicBlockInContext": {
    parameters: ["pointer", "pointer", "buffer"],
    result: "pointer",
  },

  "LLVMSetFunctionCallConv": {
    parameters: ["pointer", "pointer"],
    result: "void",
  },

  "LLVMGetParam": {
    parameters: ["pointer", "i32"],
    result: "pointer",
  },

  "LLVMLoadLibraryPermanently": {
    parameters: ["buffer"],
    result: "i32",
  },
} as const;

const searchPath: string[] = [];

const SUPPORTED_VERSIONS = [10, 14, 13, 12];

if (Deno.build.os === "linux") {
  searchPath.push(
    ...SUPPORTED_VERSIONS.map((version) =>
      `/usr/lib/llvm-${version}/lib/libLLVM.so`
    ),
  );
} else {
  throw new Error(
    "Unsupported Operating System, consider installing a linux distro",
  );
}
let LLVM!: Deno.DynamicLibrary<typeof SYMBOLS>;

for (const path of searchPath) {
  try {
    LLVM = Deno.dlopen(path, SYMBOLS);
    break;
  } catch (_) {
    continue;
  }
}

export default function plugin(address: string): Record<string, WebAssembly.ImportValue> {
  return {
    LLVMShutdown() {
      LLVM.symbols.LLVMShutdown();
    },
    LLVMCreateMessage(msg: number) {
      return BigInt(
        LLVM.symbols.LLVMCreateMessage(encode(readString(msg, WhistleStorage.memory.get(address)!))),
      );
    },
    LLVMDisposeMessage(msg: number) {
      LLVM.symbols.LLVMDisposeMessage(encode(readString(msg, WhistleStorage.memory.get(address)!)));
    },

    // Core -> Contexts
    LLVMContextCreate() {
      return BigInt(LLVM.symbols.LLVMContextCreate());
    },
    LLVMGetGlobalContext() {
      return BigInt(LLVM.symbols.LLVMGetGlobalContext());
    },
    LLVMContextDispose(ctx: bigint) {
      LLVM.symbols.LLVMContextDispose(ctx);
    },

    // Core -> Modules
    LLVMModuleCreateWithName(content: number) {
      const cstr = readString(content, WhistleStorage.memory.get(address)!)!;
      return BigInt(LLVM.symbols.LLVMModuleCreateWithName(
        encode(cstr),
      ));
    },
    LLVMModuleCreateWithNameInContext(ctx: bigint, content: number) {
      const cstr = readString(content, WhistleStorage.memory.get(address)!)!;
      return BigInt(LLVM.symbols.LLVMModuleCreateWithNameInContext(
        encode(cstr),
        ctx,
      ));
    },

    // Core -> Types
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
        argts.push(BigInt(type));
      }
      return BigInt(LLVM.symbols.LLVMFunctionType(
        type,
        Deno.UnsafePointer.of(BigUint64Array.of(...argts)),
        length,
        a2,
      ));
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

    LLVMConstInt(type: bigint, arg1: number, arg2: number) {
      return BigInt(LLVM.symbols.LLVMConstInt(type, arg1, arg2));
    },

    // Core -> Modules
    LLVMAddFunction(module: bigint, content: number, type: bigint) {
      return BigInt(
        LLVM.symbols.LLVMAddFunction(
          module,
          encode(readString(content, WhistleStorage.memory.get(address)!)),
          type,
        ),
      );
    },

    // Core -> Instruction Builders
    LLVMCreateBuilder() {
      return BigInt(LLVM.symbols.LLVMCreateBuilder());
    },
    LLVMCreateBuilderInContext(ctx: bigint) {
      return BigInt(LLVM.symbols.LLVMCreateBuilderInContext(ctx));
    },
    LLVMDisposeBuilder(builder: bigint) {
      LLVM.symbols.LLVMDisposeBuilder(builder);
    },
    LLVMPositionBuilderAtEnd(builder: bigint, block: bigint) {
      LLVM.symbols.LLVMPositionBuilderAtEnd(builder, block);
    },
    LLVMAppendBasicBlockInContext(
      context: bigint,
      func: bigint,
      content: number,
    ) {
      return BigInt(LLVM.symbols.LLVMAppendBasicBlockInContext(
        context,
        func,
        encode(readString(content, WhistleStorage.memory.get(address)!)),
      ));
    },
    LLVMBuildAdd(builder: bigint, arg2: bigint, arg3: bigint, content: number) {
      return BigInt(
        LLVM.symbols.LLVMBuildAdd(
          builder,
          arg2,
          arg3,
          encode(readString(content, WhistleStorage.memory.get(address)!)),
        ),
      );
    },
    LLVMBuildRet(builder: bigint, sum: bigint) {
      LLVM.symbols.LLVMBuildRet(builder, sum);
    },
    LLVMBuildRetVoid(builder: bigint) {
      LLVM.symbols.LLVMBuildRetVoid(builder);
    },
    LLVMDumpModule(module: bigint) {
      LLVM.symbols.LLVMDumpModule(module);
    },
    LLVMSetFunctionCallConv(func: bigint, value: bigint) {
      LLVM.symbols.LLVMSetFunctionCallConv(func, value);
    },
    LLVMGetParam(func: bigint, value: number) {
      return BigInt(LLVM.symbols.LLVMGetParam(func, value));
    },
    LLVMLoadLibraryPermanently(content: number) {
      return LLVM.symbols.LLVMLoadLibraryPermanently(
          encode(readString(content, WhistleStorage.memory.get(address)!)),
        ) === 0
        ? 1
        : 0;
    },
  }
}

