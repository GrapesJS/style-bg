export default (editor, sm) => {
  const typeColor = sm.getType('color');
  const propModel = typeColor.model;

  sm.addType('color-linear', {
    model: propModel.extend({
        getFullValue() {
            const value = this.get('value');
            return value ? `linear-gradient(${value},${value})` : '';
        },
    }),
    view: typeColor.view
  })
};