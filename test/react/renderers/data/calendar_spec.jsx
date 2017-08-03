import React from 'react';
import {Map} from 'immutable';
import chai, {expect} from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {mount} from 'enzyme';
import moment from 'moment';
import sinon from 'sinon';

import {view, data} from 'formatron/types';
import RenderData from 'formatron/renderers/renderData'
import reactRenderers from '~/react/renderers'

chai.use(chaiEnzyme());

function createRenderData(options = {}) {
  return new RenderData(
    options.dataType || new data.date(),
    options.value || 0,
    {
      onChange: options.onChange || (() => {}),
      onBlur: options.onBlur || (() => {}),
      isDisabled: () => options.disabled || false,
      getError: () => options.error || false,
      isEditable: () => options.editable || true,
    });
}

function formatValue(value, format) {
  return moment(new Date(value * 1000)).format(format);
}

function getInput(wrapper) {
  return wrapper.find('input.formatron-input-inner');
}

describe('calendar renderer', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  });

  afterEach(() => {
    clock.restore()
  });

  it('renders without exploding', () => {
    const renderData = createRenderData();
    const calendar = reactRenderers.renderTableCell(
        new view.calendar(), renderData);
    const wrapper = mount(calendar);
    expect(wrapper).to.be.present();
  })

  it('displays the initial value', () => {
    const value = 999000;
    const dataType = new data.date();
    const renderData = createRenderData({value, dataType});
    const calendar = reactRenderers.renderTableCell(
        new view.calendar(), renderData);
    const wrapper = mount(calendar);

    const formattedValue = formatValue(value, dataType.getFormat());
    expect(getInput(wrapper)).to.have.value(formattedValue);
  })

  it('uses the given format', () => {
    const value = 999000;
    const format = 'ss';
    const dataType = new data.date('', {format});
    const renderData = createRenderData({value, dataType});
    const calendar = reactRenderers.renderTableCell(
        new view.calendar(), renderData);
    const wrapper = mount(calendar);

    const formattedValue = formatValue(value, format);
    expect(getInput(wrapper)).to.have.value(formattedValue);
  })

  it('displays the new value after it is changed', () => {
    const value = 999000;
    const dataType = new data.date();
    const renderData = createRenderData({dataType});
    const calendar = reactRenderers.renderTableCell(
        new view.calendar(), renderData);
    const wrapper = mount(calendar);

    const formattedValue = formatValue(value, dataType.getFormat());
    expect(getInput(wrapper)).not.to.have.value(formattedValue);

    const newRenderData = createRenderData({dataType, value});
    wrapper.setProps({renderData: newRenderData});
    clock.tick(1000)  // Wait for the debounce.
    expect(getInput(wrapper)).to.have.value(formattedValue);
  })

  it('accepts text input and calls onChange after blur', () => {
    const dataType = new data.date();
    const onChange = sinon.spy();
    const renderData = createRenderData({dataType, onChange});
    const calendar = reactRenderers.renderTableCell(
        new view.calendar(), renderData);
    const wrapper = mount(calendar);

    const value = 999000;
    const formattedValue = formatValue(value, dataType.getFormat());
    getInput(wrapper).simulate('change', {target: {value: formattedValue}});
    getInput(wrapper).simulate('blur');
    clock.tick(1000)  // Wait for the blur timeout.
    expect(onChange.getCall(0).args[1]).to.equal(value);
  })
})