
import request from "supertest";

import app from "../../app.js";

import User from "../../src/lib/models/user.model.js";
import Session from "../../src/lib/models/session.model.js";

import { createAuthenticatedUser } from "../utils/auth.js";

const validUser = {
  username: "tester",
  email: "tester@example.com",
  password: "password123"
};

describe("POST /api/v1/auth/signup", () => {

  it("debería crear un usuario (ruta pública, sin cookie)", async () => {
    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser)
        .expect(201);

    expect(res.body).toHaveProperty("username", "tester");
    expect(res.body).toHaveProperty("email", "tester@example.com");
    expect(res.body).not.toHaveProperty("password");
  });

  it("debería fallar si el email ya existe", async () => {
    await User.create(validUser);

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({ ...validUser, username: "otheruser" })
        .expect(409);

    expect(res.body).toHaveProperty("message", "Resource duplicate");
  });

});

describe("POST /api/v1/auth/login", () => {

  beforeEach(async () => {
    await User.create(validUser);
  });

  it("debería iniciar sesión y devolver una cookie de sesión (ruta pública)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password
    })
    .expect(200);

    expect(res.body).toHaveProperty("email", validUser.email);

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie.some(c => c.startsWith("sessionId="))).toBe(true);
  });

  it("debería fallar si la contraseña es incorrecta", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
          email: validUser.email,
          password: "wrong-password"
      })
      .expect(404);

    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });

  it("debería fallar si faltan credenciales", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: validUser.email })
      .expect(400);

    expect(res.body).toHaveProperty("message", "Fields required");
  });

});

describe("GET /api/v1/auth/verify", () => {

  it("debería devolver el usuario de la sesión activa", async () => {
    const { cookie, user } = await createAuthenticatedUser();

    const res = await request(app)
      .get("/api/v1/auth/verify")
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body).toHaveProperty("email", user.email);
  });

  it("debería devolver 401 sin cookie de sesión", async () => {
    const res = await request(app)
      .get("/api/v1/auth/verify")
      .expect(401);

    expect(res.body).toHaveProperty("message", "Unauthorized");
  });

  it("debería devolver 401 con una sesión que no existe", async () => {
    const res = await request(app)
      .get("/api/v1/auth/verify")
      .set("Cookie", "sessionId=000000000000000000000000")
      .expect(401);

    expect(res.body).toHaveProperty("message", "Unauthorized");
  });

});

describe("DELETE /api/v1/auth/logout", () => {

  it("debería cerrar la sesión y eliminarla de la base de datos", async () => {
    const { cookie, session } = await createAuthenticatedUser();

    await request(app)
      .delete("/api/v1/auth/logout")
      .set("Cookie", cookie)
      .expect(204);

    const deleted = await Session.findById(session._id);
    expect(deleted).toBeNull();
  });

  it("debería devolver 401 sin cookie de sesión", async () => {
    await request(app)
      .delete("/api/v1/auth/logout")
      .expect(401);
  });

});