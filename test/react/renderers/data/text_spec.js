import React from 'react';
import chai, {expect} from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {mount} from 'enzyme';
import moment from 'moment';
import sinon from 'sinon';

import {view, data} from 'formatron/types';
import RenderData from 'formatron/renderers/renderData';
import reactRenderers from '~/react/renderers';
import createRenderData from '../../../_helpers/createRenderData';

chai.use(chaiEnzyme());

describe('text renderer', () => {
  it('renders without exploding', () => {
    const dataType = new data.text();
    const renderData = createRenderData(dataType, 'hi');
    const text = reactRenderers.renderTableCell(new view.text(), renderData);
    const wrapper = mount(text);

    expect(wrapper).to.be.present();
  });

  it('renders formatted ssn', () => {
    const dataType = new data.text('', {textType: 'ssn'});
    const renderData = createRenderData(dataType, '007691234');
    const text = reactRenderers.renderTableCell(new view.text(), renderData);
    const wrapper = mount(text);

    expect(wrapper.find('input')).to.have.value('007-69-1234');
  });

  it('renders formatted phone number', () => {
    const dataType = new data.text('', {textType: 'tel'});
    const renderData = createRenderData(dataType, '8028643334');
    const text = reactRenderers.renderTableCell(new view.text(), renderData);
    const wrapper = mount(text);

    expect(wrapper.find('input')).to.have.value('(802) 864-3334');
  });
});
