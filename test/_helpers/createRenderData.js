import RenderData from 'formatron/renderers/renderData';

export default function createRenderData(type, value, options = {}) {
  return new RenderData(type, value, {
    onChange: () => {},
    onBlur: () => {},
    isDisabled: () => false,
    getError: () => false,
    isEditable: () => true,
    ...options,
  });
}
