const { expect } = require('chai');
const { getPersonById } = require('../lib/people');

describe('getPersonById', () => {
  it('should return the correct person object', async () => {
    const person = await getPersonById(2);
    expect(person).to.have.property('name', 'Miss Piggy');
  });

  it('should return undefined for unknown ID', async () => {
    const person = await getPersonById(999);
    expect(person).to.be.undefined;
  });

  it('should return a person object with valid ID', async () => {
    const person = await getPersonById(1);
    expect(person).to.be.an('object');
    expect(person).to.have.property('name');
    expect(person).to.have.property('email');
  });
});
