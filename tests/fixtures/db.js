const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
	_id: testUserId,
	name: "Test User",
	email: "test@example.com",
	password: "1234567!!",
	tokens: [
		{
			token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
		}
	]
};

const testUser2Id = new mongoose.Types.ObjectId();
const testUser2 = {
	_id: testUser2Id,
	name: "Test User 2",
	email: "test2@example.com",
	password: "1234567!!",
	tokens: [
		{
			token: jwt.sign({ _id: testUser2Id }, process.env.JWT_SECRET)
		}
	]
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: "test Task one",
	completed: false,
	owner: testUserId
};

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: "test Task two",
	completed: true,
	owner: testUserId
};

const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: "test Task three",
	completed: true,
	owner: testUser2Id
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(testUser).save();
	await new User(testUser2).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	testUserId,
	testUser,
	testUser2,
	setupDatabase,
	taskOne
};
