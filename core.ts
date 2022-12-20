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
export { LLVM as default };
