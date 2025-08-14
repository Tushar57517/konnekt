import request from "supertest";
import { describe, it, jest } from "@jest/globals";

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
    deleteOne: jest.fn().mockResolvedValue({})
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

  it("GET /api/certificates/id/:certId - returns one certificate", async () => {
    const mockCert = { _id: 123, name: "cert name" };

    Certificate.findById.mockResolvedValue(mockCert);

    const res = await request(app)
      .get("/api/certificates/id/123")
      .set("Authorization", "Bearer faketoken");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("cert name");
  });

  it("PATCH /api/certificates/update/:certId", async () => {
    const updatedCert = {
      _id: "cert123",
      name: "Updated Cert",
      org: "Updated Org",
    };

    Certificate.findByIdAndUpdate.mockResolvedValue(updatedCert);

    const res = await request(app)
      .patch("/api/certificates/update/cert123")
      .send({ name: "Updated Cert", org: "Updated Org" })
      .set("Authorization", "Bearer faketoken");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("certification updated");
    expect(res.body.certificate).toEqual(updatedCert);
    expect(Certificate.findByIdAndUpdate).toHaveBeenCalledWith(
      "cert123",
      { name: "Updated Cert", org: "Updated Org" },
      { runValidators: true, new: true }
    );
  });

  it("DELETE /api/certificates/delete/:certId - deletes a certificate", async () => {
    const mockProfile = {
      _id: "profile123",
      user: "mockUserId",
    };

    const mockCert = {
      _id: "cert123",
      profile: "profile123",
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    Certificate.findById.mockResolvedValue(mockCert);

    Profile.findById.mockResolvedValue(mockProfile);

    Profile.findByIdAndUpdate.mockResolvedValue({});

    const res = await request(app)
      .delete("/api/certificates/delete/cert123")
      .set("Authorization", "Bearer faketoken");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("certification deleted successfully");

    expect(Certificate.findById).toHaveBeenCalledWith("cert123");
    expect(Profile.findById).toHaveBeenCalledWith("profile123");
    expect(mockCert.deleteOne).toHaveBeenCalled();
    expect(Profile.findByIdAndUpdate).toHaveBeenCalledWith("profile123", {
      $pull: { Certificates: "cert123" },
    });
  });
});
