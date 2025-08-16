import request from "supertest";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../middlewares/auth.middleware.js", () => ({
  verifyToken: (req, res, next) => {
    req.userId = "mockUserId";
    next();
  },
}));

jest.unstable_mockModule("../models/experience.model.js", () => ({
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/profile.model.js", () => ({
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
}));

const app = (await import("../app.js")).default;
const Experience = (await import("../models/experience.model.js")).default;
const Profile = (await import("../models/profile.model.js")).default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Experience Routes", () => {
  it("POST /api/experience/new - create new experience", async () => {
    const profile = {
      _id: 123,
      experience: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const exp = {
      title: "test",
      org: "test",
      startDate: "2023-10-03",
      endDate: "2024-10-02",
    };

    Profile.findOne.mockResolvedValue(profile);

    Experience.create.mockResolvedValue(exp);

    const res = await request(app)
      .post("/api/experience/new")
      .send(exp)
      .set("Authorization", "Bearer fake-token");

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("experience added");
    expect(profile.save).toHaveBeenCalled();
  });

  it("GET /api/experience/profile/:profileId - get all experiences", async () => {
    const exp = {
      _id: 1234,
      profile: 123,
      title: "test",
      org: "test",
      startDate: "2025-10-10",
      endDate: "2024-10-10",
    };

    Profile.findById.mockResolvedValue({
      _id: 123,
      experience: [],
    });

    Experience.find.mockResolvedValue([exp]);

    const res = await request(app)
      .get("/api/experience/profile/123")
      .set("Authorization", "fake-token");

    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe("test");
  });

  it("GET /api/experience/id/:expId", async () => {
    const exp = {
      _id: 1234,
      profile: 123,
      title: "test",
      org: "test",
      startDate: "2025-10-10",
      endDate: "2024-10-10",
    };

    Experience.findById.mockResolvedValue(exp);

    const res = await request(app)
      .get("/api/experience/id/123")
      .set("Authorization", "fake-token");

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("test");
  });

  it("PATCH /api/experience/update/123", async () => {
    const exp = {
      _id: 123,
      title: "updated title",
      org: "updated org",
    };

    Experience.findByIdAndUpdate.mockResolvedValue(exp);

    const res = await request(app)
      .patch("/api/experience/update/123")
      .send({ title: "updated title", org: "updated org" })
      .set("Authorization", "fake-token");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("experience updated");
    expect(res.body.experience.title).toBe("updated title");

    expect(Experience.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { title: "updated title", org: "updated org" },
      { runValidators: true, new: true }
    );
  });

  it("DELETE /api/experience/delete/:expId", async () => {
    const profile = {
      _id: "1234",
      user: "mockUserId",
    };

    const mockExp = {
      _id: "123",
      profile: "1234",
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    Experience.findById.mockResolvedValue(mockExp);

    Profile.findOne.mockResolvedValue(profile);

    Profile.findByIdAndUpdate.mockResolvedValue({});

    const res = await request(app)
      .delete("/api/experience/delete/123")
      .set("Authorization", "fake-token");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("experience deleted");

    expect(Experience.findById).toHaveBeenCalledWith("123");
    expect(Profile.findOne).toHaveBeenCalledWith({ user: "mockUserId" });
    expect(mockExp.deleteOne).toHaveBeenCalled();
    expect(Profile.findByIdAndUpdate).toHaveBeenCalledWith("1234", {
      $pull: { experience: "123" },
    });
  });
});
