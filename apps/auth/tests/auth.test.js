import request from "supertest";
import { it, jest } from "@jest/globals";

jest.unstable_mockModule("../models/user.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: { hash: jest.fn() },
}));

const bcrypt = (await import("bcrypt")).default;
const app = (await import("../app.js")).default;
const User = (await import("../models/user.model.js")).default;

describe("POST api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when email or password is empty", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "  ",
      password: "   ",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "all fields required" });
  });

  it("returns 409 when register with the same email twice", async () => {
    const payload = { email: "test@email.com", password: "1234" };

    User.findOne
      .mockResolvedValueOnce(null) // First request: no user exists
      .mockResolvedValueOnce({ email: payload.email }); // Second request: user exists

    // User.create.mockResolvedValueOnce({ email: payload.email });

    await request(app).post("/api/auth/register").send(payload);

    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: "use another email" });
  });

  it("returns 200 when user registered ssuccessfully", async () => {
    const payload = { email: "test@email.com", password: "1234" };

    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "user registered successfully" });
  });
});
