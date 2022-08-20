const { faker } = require("@faker-js/faker");
const User = require("../models/db-user");

const createFakeData = () => {

    let usersFake = [];

    for (let i = 0; i < 15; i++) {
        const name = faker.name.firstName();
        const lastname = faker.name.lastName();

        let user = {
            name: `${name} ${lastname}`,
            email: faker.internet.email(name + lastname),
            password: faker.random.numeric(6),
            role: "USER_ROLE",
            state: true,
            google: false,
        }

        usersFake.push(user);
    }

    User.create(usersFake);
}

module.exports = {
    createFakeData
}