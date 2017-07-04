import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import moment from 'moment';

import Form from '../../src/components/form';

chai.use(chaiEnzyme());

const mockSchema = {
  validate: () => {},
  validateSingle: () => {},
  resolveChanges: () => {},
  renderForm: () => {},
};

describe('Form', () => {
  it('has passed in class', () => {
    const wrapper = shallow(<Form schema={mockSchema} className="myclass" />);
    expect(wrapper).to.have.className('myclass');
  });
});
