import React from 'react';
import chai, {expect} from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import moment from 'moment';

import 'formatron/types';
import {Label} from 'formatron/react';

chai.use(chaiEnzyme());

describe('Form', () => {
  it('renders without exploding', () => {
    const wrapper = shallow(<Label />);
    expect(wrapper).to.be.present();
  });

  it('renders the passed in child string', () => {
    const wrapper = shallow(<Label children={['hi']} />);
    expect(wrapper).to.include.text('hi');
  });

  it('can be required', () => {
    const wrapper = shallow(<Label children={[]} required={true} />);
    expect(wrapper).to.have.className('formatron-required');
  });
});
