'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   
     return queryInterface.bulkInsert(
        "users",
        [
            {
                email: "dumbways@mail.com",
                fullName: "Fahrul ihsan",
                phone: "089878767654",
                gender: "male",
                address: "bogor",
                role: "admin",
                subscribe: true,
                password:
                "$2b$10$7KXa8ANtY3dRTEM3TtOEQeTAFgGhmgnfXxYS8O/TgpD95z96wWL9q", //123456
            },
        ],
        {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
