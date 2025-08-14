import request from "supertest";
import { describe, it, jest } from "@jest/globals";

jest.unstable_mockModule("../models/user.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: { hash: jest.fn(), compare: jest.fn() },
}));

jest.unstable_mockModule("../queues/userQueue.js", () => ({
  default: { add: jest.fn().mockResolvedValue(true) },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn().mockReturnValue("fake-token"),
  },
}));

const bcrypt = (await import("bcrypt")).default;
const app = (await import("../app.js")).default;
const User = (await import("../models/user.model.js")).default;
const userQueue = (await import("../queues/userQueue.js")).default;
const jwt = (await import("jsonwebtoken")).default;

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

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({ _id: "user123", email: payload.email });
    userQueue.add.mockResolvedValue(true);

    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "user registered successfully" });

    expect(userQueue.add).toHaveBeenCalledWith("init new profile", {
      userId: "user123",
      email: payload.email,
    });
  });
});

describe("POST api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when email or password is empty", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "  ",
      password: "   ",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "all fields required" });
  });

  it("returns 404 when user doesn't exists", async () => {
    const payload = { email: "test@email.com", password: "1234" };

    User.findOne.mockResolvedValueOnce(null);

    const res = await request(app).post("/api/auth/login").send(payload);

    expect(res.status).toBe(404);
    expect(res.body).toStrictEqual({ error: "user not found" });
  });

  it("returns 403 when password doesn't match", async () => {
    const payload = { email: "test@email.com", password: "1234" };

    User.findOne.mockResolvedValue({
      _id: "user123",
      email: payload.email,
      password: "hashed-password",
    });

    const invalidPayload = { email: "test@email.com", password: "1233" };

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post("/api/auth/login").send(invalidPayload);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "password doesn't match" });
  });

  it("returns 200 with a token", async () => {
    const payload = { email: "test@email.com", password: "1234" };

    User.findOne.mockResolvedValue({
      _id: "user123",
      email: payload.email,
      password: "hashed-password",
    });

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue("fake-token");

    const res = await request(app).post("/api/auth/login").send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ token: "fake-token" });

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "user123" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  });
});
