const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { testUser, testUserId, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Dimon",
			email: "dimon@example.com",
			password: "1234567!!"
		})
		.expect(201);

	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();
	expect(response.body).toMatchObject({
		user: {
			name: "Dimon"
		}
	});
});

test("Should login an existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: testUser.email,
			password: testUser.password
		})
		.expect(200);

	const user = await User.findById(response.body.user._id);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: "hi",
			password: testUser.password
		})
		.expect(400);
});

test("Should get user profile", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${testUser.tokens[0].token}`)
		.send()
		.expect(200);
});

test("Should not get profile for unathenticated user", async () => {
	await request(app)
		.get("/users/me")
		.send()
		.expect(401);
});

test("Should delete account for user", async () => {
	await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${testUser.tokens[0].token}`)
		.send()
		.expect(200);
	const user = await User.findById(testUser._id);
	expect(user).toBeNull();
});

test("Should not delete account for unathenticated user", async () => {
	await request(app)
		.delete("/users/me")
		.send()
		.expect(401);
});

test("Should upload avatar image", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${testUser.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/avatar.jpg")
		.expect(200);
	const user = await User.findById(testUserId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
	await request(app)
		.patch("/users/me/")
		.set("Authorization", `Bearer ${testUser.tokens[0].token}`)
		.send({ name: "David" })
		.expect(200);

	const user = await User.findById(testUserId);
	expect(user.name).toEqual("David");
});

test("Should not update invalid user fields", async () => {
	await request(app)
		.patch("/users/me/")
		.set("Authorization", `Bearer ${testUser.tokens[0].token}`)
		.send({ location: "London" })
		.expect(400);
});
