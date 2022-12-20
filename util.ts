// deno-lint-ignore-file no-explicit-any
export const encode = (value: string) => new TextEncoder().encode(value);
export const readString = (
  ptr: any,
  mem: any,
) => {
  const view = new Uint8Array(mem.buffer);
  let end = ptr;
  while (view[end]) ++end;
  return (new TextDecoder()).decode(new Uint8Array(view.subarray(ptr, end)));
};

export const cstring = (ptr: Deno.PointerValue, offset?: number) =>
  new Deno.UnsafePointerView(ptr).getCString(offset);
