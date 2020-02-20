
const assertEqualValidation = function(actual,expected){
  if(actual===expected){
    console.log(`Assertion Passed: ${actual} === +${expected}`);
  }else {
    console.log(`Assertion Failed: ${actual} !== ${expected}`);
  }
};
// assertEqual("Lighthouse Labs","Bootcamp");
//asserEqual(1,1);

module.exports = assertEqualValidation;