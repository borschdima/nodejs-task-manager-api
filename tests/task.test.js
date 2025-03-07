const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { testUser, testUserId, testUser2, setupDatabase, taskOne } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
	const response = await request(app)
		.post("/tasks")
		.set("Authorization", `Bearer ${testUser.tokens[0].token}`)
		.send({ description: "From my test" })
		.expect(201);

	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toEqual(false);
});

test("Should return all tasks for a user", async () => {
	const response = await request(app)
		.get(`/tasks`)
		.set("Authorization", `Bearer ${testUser.tokens[0].token}`)
		.send()
		.expect(200);

	expect(response.body.length).toEqual(2);
});

test("Should not delete other users tasks", async () => {
	await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.set("Authorization", `Bearer ${testUser2.tokens[0].token}`)
		.send()
		.expect(404);

	const task = await Task.findById(taskOne._id);
	expect(task).not.toBeNull();
});
