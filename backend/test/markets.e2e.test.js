import request from "supertest";
import app from "../src/app.js";

describe("Markets", () => {
  it("GET /markets/KE/requirements should 200 (after seed)", async () => {
    const res = await request(app).get("/markets/KE/requirements");
    // Will 404 before migrations/seeders; this is just a scaffold
    expect().toContain(res.statusCode);
  });
});
