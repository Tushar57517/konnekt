import request from "supertest";
import { jest } from "@jest/globals";
import mongoose from "mongoose";

jest.unstable_mockModule("../middlewares/auth.middleware.js", () => ({
  verifyToken: (req, res, next) => {
    req.userId = "mockUserId";
    next();
  },
}));

jest.unstable_mockModule("../models/education.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn().mockResolvedValue({}),
  },
}));

jest.unstable_mockModule("../models/profile.model.js", () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const app = (await import("../app.js")).default;
const Education = (await import("../models/education.model.js")).default;
const Profile = (await import("../models/profile.model.js")).default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Education Routes", () => {
  it("POST /api/education/new - creates new education", async () => {
    const payload = {
      institute: "test institute",
      course: "test course",
      startDate: "2023-10-03",
      endDate: "2024-10-02",
    };

    Profile.findOne.mockResolvedValue({
      _id: 123,
      education: [],
      save: jest.fn(),
    });

    Education.create.mockResolvedValue(payload);

    const res = await request(app)
      .post("/api/education/new")
      .send(payload)
      .set("Authorization", "Bearer fake-token");

    expect(res.status).toBe(201);
    expect(res.body.education.institute).toBe("test institute");

    expect(Education.create).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: 123,
        institute: "test institute",
      })
    );
  });

  it("GET /api/education/profile/:profileId - get all education", async () => {
    const testEdu = {
      profile: 123,
      institute: "test institute",
      course: "test",
      startDate: "2023-10-02",
      endDate: "2024-10-03",
      grade: "A",
    };

    Profile.findById.mockResolvedValue({
      _id: 123,
      education: [],
    });

    Education.find.mockResolvedValue([testEdu]);

    const res = await request(app)
      .get("/api/education/profile/123")
      .set("Authorization", "fake-token");

    expect(res.status).toBe(200);
    expect(res.body[0].course).toBe("test");
  });

  it("GET /api/education/id/:eduId - get education by id", async () => {
    const testEdu = {
      profile: 123,
      _id: 123,
      institute: "test institute",
      course: "test",
      startDate: "2023-10-02",
      endDate: "2024-10-03",
      grade: "A",
    };

    Education.findById.mockResolvedValue(testEdu);

    const res = await request(app)
      .get("/api/education/id/123")
      .set("Authorization", "fake-token");

    expect(res.status).toBe(200);
    expect(res.body.course).toBe("test");
  });

  it("PATCH /api/education/update/:eduId - update education", async () => {
    const updatedEdu = {
      _id: 123,
      course: "updated test",
    };

    Education.findByIdAndUpdate.mockResolvedValue(updatedEdu);

    const res = await request(app)
      .patch("/api/education/update/123").send({course:"updated test"})
      .set("Authorization", "fake-token");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("education updated");
    expect(res.body.education.course).toBe("updated test");

    expect(Education.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { course: "updated test" },
      { runValidators: true, new: true }
    );
  });

  it("DELETE /api/education/delete/:eduId - deletes an education", async () => {
      const mockProfile = {
        _id: "123",
        user: "mockUserId",
      };
  
      const validEduId = "507f1f77bcf86cd799439011";

      const mockEdu = {
        _id: validEduId,
        profile: "123",
        deleteOne: jest.fn().mockResolvedValue({}),
      };
  
      Education.findById.mockResolvedValue(mockEdu);
  
      Profile.findById.mockResolvedValue(mockProfile);
  
      Profile.findByIdAndUpdate.mockResolvedValue({});
  
      const res = await request(app)
        .delete("/api/education/delete/1234")
        .set("Authorization", "Bearer fake-token");
  
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("education deleted");
  
      expect(Education.findById).toHaveBeenCalledWith("1234");
      expect(Profile.findById).toHaveBeenCalledWith("123");
      expect(mockEdu.deleteOne).toHaveBeenCalled();
      expect(Profile.findByIdAndUpdate).toHaveBeenCalledWith("123", {
        $pull: { education: expect.any(mongoose.Types.ObjectId) },
      });
    });
});
