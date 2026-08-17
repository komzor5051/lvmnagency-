import { defineConfig, devices } from "@playwright/test";

// Тесты гоняются против dev-сервера: проверяемое поведение живёт в CSS и в
// инлайн-скрипте, они одинаковы в dev и prod, а сборка на этой машине долгая.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    // Переиспользуемый dev-сервер уже дважды отдавал закэшированный HTML со
    // старой версией инлайн-скрипта — в CI сервер всегда должен стартовать
    // заново, локально можно переиспользовать для скорости.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
