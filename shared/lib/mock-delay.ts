export async function mockDelay(duration = 220) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}
