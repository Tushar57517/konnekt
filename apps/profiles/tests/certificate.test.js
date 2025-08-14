import request from "supertest";
import { describe, jest } from "@jest/globals";

jest.unstable_mockModule("../middlewares/auth.middleware.js", () => ({
  verifyToken: (req, res, next) => {
    req.userId = "mockUserId";
    next();
  },
}));

jest.unstable_mockModule("../models/certificate.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
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
const Certificate = (await import("../models/certificate.model.js")).default;
const Profile = (await import("../models/profile.model.js")).default;

describe("Certificates Routes", () => {
  it("POST /api/certificates/new - create a certificate", async () => {
    Profile.findOne.mockResolvedValue({
      _id: "profile123",
      Certificates: [],
      save: jest.fn(),
    });

    Certificate.create.mockResolvedValue({ _id: "cert123", name: "Test Cert" });

    const res = await request(app)
      .post("/api/certificates/new")
      .send({
        name: "Test Cert",
        org: "Org Name",
        issueDate: "2024-01-01",
        expDate: "2025-01-01",
      })
      .set("Authorization", "Bearer faketoken"); 

    expect(res.statusCode).toBe(201);
    expect(res.body.certificate.name).toBe("Test Cert");
    expect(Certificate.create).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: "profile123",
        name: "Test Cert",
      })
    );
  });

  it("GET /api/certificates/:profileId - should return certificates", async () => {
    Certificate.find.mockResolvedValue([{ _id: "cert1", name: "Cert 1" }]);

    const res = await request(app)
      .get("/api/certificates/profile123")
      .set("Authorization", "Bearer faketoken");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].name).toBe("Cert 1");
  });
});
