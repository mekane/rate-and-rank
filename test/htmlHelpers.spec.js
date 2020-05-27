const expect = require('chai').expect;

const helpers = require('../src/htmlHelpers');

describe('Converting arbitrary strings to valid css class names', () => {
    it('adds a letter at the beginning', () => {
        expect(helpers.toCssClassName('123')).to.equal('c123');
    });

    it('does nothing for empty strings', () => {
        expect(helpers.toCssClassName('')).to.equal('c');
    });

    it('replaces whitespace with _', () => {
        expect(helpers.toCssClassName('a b\tc\nd')).to.equal('ca_b_c_d');
    });

    it('keeps underscores', () => {
        expect(helpers.toCssClassName('a_1_b2')).to.equal('ca_1_b2');
    });

    it('converts dashes to underscores', () => {
        expect(helpers.toCssClassName('a-1-b2')).to.equal('ca_1_b2');
    });

    it('removes non-word characters', () => {
        expect(helpers.toCssClassName('a\\:/.,~`!@#$%^&*+<>?"')).to.equal('ca');
    });

    it('removes other special characters', () => {
        expect(helpers.toCssClassName(`a(){}[]':;`)).to.equal('ca');
    });
})