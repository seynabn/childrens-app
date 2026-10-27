
export function isJwtError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if (!("code" in error)) {
    return false;
  }

  return (
    typeof error.code === "string" &&
    error.code.startsWith("FST_JWT")
  );
}
