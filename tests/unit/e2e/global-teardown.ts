export default async function globalTeardown() {
  // Close MSW server to prevent port conflicts
  if ((global as any).__MSW_SERVER__) {
    await (global as any).__MSW_SERVER__.close();
  }
}
