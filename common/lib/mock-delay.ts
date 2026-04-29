export async function mockDelay(duration = 50) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}
