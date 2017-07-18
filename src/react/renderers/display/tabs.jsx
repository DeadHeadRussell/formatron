import {Tabs, Tab, TabList, TabPanel} from 'react-tabs';

import Label from '~/react/components/label';
import TabsType from '~/types/view/display/tabs';

import ReactRenderer from '../reactRenderer';

// TODO: See if there's a simple way to expose the hashtag functionality so
// users can hook this up to whatever routing solution they use.
// Maybe add in a callback on the render data options?
class FormatronTabs extends React.Component {
  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange);
  }

  onHashChange = e => {
    setTimeout(() => this.forceUpdate());
  }

  onTabSelect = index => {
    window.location.hash = this.props.viewType.
      getTabLabel(
        this.props.viewType
          .getTabs()
          .get(index),
        this.props.renderData
      );
  }

  render() {
    const {viewType, renderData, renderers, rendererMethod} = this.props;

    const tabs = viewType.getTabs();

    const hash = window.location.hash.slice(1);
    const selected = Math.max(
      tabs.findIndex(tab => viewType.getTabLabel(tab, renderData) == hash),
      0
    );

    return (
      <div className='formatron-tabs'>
        <Label>{viewType.getLabel(renderData)}</Label>
        <Tabs
          selectedIndex={selected}
          onSelect={this.onTabSelect}
        >
          <TabList>
            {tabs.map((tab, i) => (
              <Tab key={i}>
                {viewType.getTabLabel(tab, renderData)}
              </Tab>
            ))}
          </TabList>

          {tabs.map((tab, i) => (
            <TabPanel key={i}>
              {renderers[rendererMethod](tab.get('display'), renderData)}
            </TabPanel>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default ReactRenderer.register(
  TabsType,
  FormatronTabs,
  FormatronTabs
);

