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
                email: "dumbsound@gmail.com",
                fullName: "Fahrul ihsan",
                phone: "089878767654",
                gender: "male",
                address: "bogor",
                role: "admin",
                subscribe: true,
                password:
                "$2b$10$EscsU0Eak08Km.Um2f6oreyoZO2QkvsXeyi06GHoVd3h97mfTYNmy", //dumbsound123
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
