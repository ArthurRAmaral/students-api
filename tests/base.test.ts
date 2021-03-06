import app from ".";
import supertest from "supertest";

describe("Test base requests", () => {
  it("should return pong v2", async () => {
    await supertest(app)
      .get("/ping")
      .expect(200)
      .then((res) => expect(res.text).toBe("pong v2"));
  });
});
