import parseTemplate from '~/template';

export default {
  create: function(template, fallback) {
    return new LabelType(template, fallback);
  }
};

class LabelType {
  constructor(label, fallback) {
    this.label = label;
    this.fallback = fallback;
  }

  render(getValue) {
    const label = parseTemplate(this.label, getValue);
    if (label) {
      return label;
    }

    if (this.fallback) {
      const fallbackLabel = parseTemplate(this.fallback, getValue);
      if (fallbackLabel) {
        return fallbackLabel;
      }
    }

    return '';
  }
}

