import type grapesjs from 'grapesjs';

export default (editor: grapesjs.Editor) => {
  const typeColor = editor.Styles.getType('color');
  const propModel = typeColor.model;

  editor.Styles.addType('color-linear', {
    model: propModel.extend({
        getFullValue() {
            const value = this.get('value');
            const def = this.get('defaults');
            return value ?
              (value === def ? def : `linear-gradient(${value},${value})`) :
              '';
        },
    }),
    view: typeColor.view
  })
};