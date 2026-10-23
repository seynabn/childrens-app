const deniedFetch = async () => {
  throw new Error("Network access is disabled in deterministic automated tests");
};

globalThis.fetch = deniedFetch as unknown as typeof globalThis.fetch;
