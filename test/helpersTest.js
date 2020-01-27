const { assert } = require('chai');
const assertEqualValidationl = require('../assertEqualValidation');
const getUserByEmail = require('../helpers').getUserByEmail;

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assertEqualValidationl((user.emailUser),expectedOutput);
    // Write your assert statement here
  });
});