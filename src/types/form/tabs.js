import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Tabs, Tab, TabList, TabPanel} from 'react-tabs';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('tabs', {
    parseOptions(options, parseField) {
      return options
        .update('tabs', tabs => tabs
          .map(tab => tab
            .update('properties', props => props
              .map(parseField)
            )
          )
        );
    },
    Component: TabsComponent
  });
}

// TODO: See if there's a simple way to expose the hashtag functionality so
// users can hook this up to whatever routing solution they use.
// Maybe add in a callback on the callbacks object?
class TabsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onHashChange = this.onHashChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange);
  }

  onHashChange(e) {
    setTimeout(() => this.forceUpdate());
  }

  render() {
    const tabs = this.props.options.get('tabs');

    const hash = window.location.hash.slice(1);
    const selected = Math.max(
      tabs.findIndex(tab => tab.get('label') == hash),
      0
    );

    return <div className='form-tabs'>
      <Label>{this.props.options.get('label')}</Label>
      <Tabs
        selectedIndex={selected}
        onSelect={index => window.location.hash = tabs.getIn([index, 'label'])}
      >
        <TabList>
          {tabs.map((tab, i) => <Tab key={i}>{tab.get('label')}</Tab>)}
        </TabList>
        {tabs.map((tab, i) => <TabPanel key={i}>
          {tab.get('properties').map((field, j) =>
            <field.Component key={j} getters={this.props.getters} callbacks={this.props.callbacks} />
          )}
        </TabPanel>)}
      </Tabs>
    </div>;
  }
}

TabsComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    tabs: ImmutablePropTypes.listOf(
      ImmutablePropTypes.contains({
        label: React.PropTypes.string.isRequired,
        properties: ImmutablePropTypes.listOf(
          FormPropTypes.display.isRequired
        ).isRequired
      }).isRequired
    ).isRequired
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

