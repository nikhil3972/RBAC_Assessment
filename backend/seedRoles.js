const mongoose = require('mongoose');
const Role = require('./models/Role');
require('dotenv').config();

const seedRoles = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const roles = ['admin', 'user'];

    for (let name of roles) {
        const exists = await Role.findOne({ name });
        if (!exists) {
            await Role.create({ name });
            console.log(`Role ${name} created`);
        }
    }

    console.log('Seeding completed');
    process.exit();
};

seedRoles();