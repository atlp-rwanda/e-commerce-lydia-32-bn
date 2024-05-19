'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    const usersData = [
      {
        firstname: 'test',
        othername: 'user',
        email: 'test@gmail.com',
        phone: '1234567890',
        password: 'password123',
        usertype: 'customer',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
        isAdmin: false
      },
    ];

   
    await queryInterface.bulkInsert('users', usersData, {});
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkDelete('users', null, {});
  }
};
