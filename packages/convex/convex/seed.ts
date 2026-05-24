import { action } from "./_generated/server";

export const vercelKvHelper = action({
  args: {},
  handler: async () => {
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    const testKey = "test-vercel-kv-integration";
    const testValue = `test-${Date.now()}`;

    await redis.set(testKey, testValue);
    const retrieved = await redis.get<string>(testKey);

    await redis.del(testKey);

    return {
      success: retrieved === testValue,
      set: testValue,
      got: retrieved,
    };
  },
});
