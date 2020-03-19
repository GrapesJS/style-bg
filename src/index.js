import styleGradient from 'grapesjs-style-gradient';
import * as styleTypesAll from './styleTypes';
import loadColorLinear from './colorLinear';
import { typeBgKey } from './utils';

export default (editor, opts = {}) => {
  const options = { ...{
    // Options for the `grapesjs-style-gradient` plugin
    styleGradientOpts: {},

    // Extend single style property definition of the plugin.
    // You can this, for example, to change the defauld gradient color
    propExtender: p => p,

    // Use this function to change/add/extend style properties for each BG type
    typeProps: p => p,
  },  ...opts };

  let styleTypes = { ...styleTypesAll };
  const sm = editor.StyleManager;
  const stack = sm.getType('stack');
  const propModel = stack.model;
  styleTypes = Object.keys(styleTypes).reduce((acc, item) => {
    const prop = styleTypes[item];
    acc[item] = options.propExtender(prop) || prop;
    return acc;
  }, {});
  const getPropsByType = type => {
    let result = [
      styleTypes.typeImage,
      styleTypes.typeBgRepeat,
      styleTypes.typeBgPos,
      styleTypes.typeBgAttach,
      styleTypes.typeBgSize,
    ];

    switch (type) {
      case 'color':
        result = [ styleTypes.typeColorLin ]
        break;
      case 'grad':
        result = [ styleTypes.typeGradient ]
        break;
    }

    return options.typeProps(result, type) || result;
  };

  styleGradient(editor, {
    colorPicker: 'default',
    inputDirection: { property: '__gradient-direction' },
    inputType: { property: '__gradient-type' },
    ...options.styleGradientOpts,
  });
  loadColorLinear(editor, sm);
  sm.addType('bg', {
    model: propModel.extend({
      defaults: () => ({
        ...propModel.prototype.defaults,
        detached: 1,
        preview: 1,
        full: 1,
        prepend: 1,
        properties: [
          styleTypes.typeBg,
          ...getPropsByType(),
        ],
      }),

      init() {
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.listenTo(this.getLayers(), 'add', this.onNewLayerAdd);
      },

      _updateLayerProps(layer, type) {
        const props = layer.get('properties');
        props.remove(props.filter((it, id) => id !== 0));
        getPropsByType(type).forEach(item => props.push(item))
      },

      /**
       * On new added layer we should listen to filter_type change
       * @param  {Layer} layer
       */
      onNewLayerAdd(layer) {
        const typeProp = layer.getPropertyAt(0);
        layer.listenTo(typeProp, 'change:value', this.handleTypeChange)
      },

      handleTypeChange(propType, type, opts) {
        const currLayer = this.getCurrentLayer();
        currLayer && this._updateLayerProps(currLayer, type);
        opts.fromInput && this.trigger('updateValue');
      },

      getLayersFromTarget(target, { resultValue } = {}) {
        const layers = [];
        const layerValues = resultValue || target.getStyle()[this.get('property')];
        const types = layerValues[typeBgKey];

        if (types) {
          this.splitValues(types).forEach((type, idx) => {
            const props = getPropsByType(type);
            layers.push({
              properties: [
                { ...styleTypes.typeBg, value: type },
                ...props.map(prop => {
                  const values = this.splitValues(layerValues[prop.property]);
                  let value = values[idx];

                  if (prop.type == 'color-linear') {
                    const parsedValue = this.parseValue(value, { complete: 1 });
                    value = this.splitValues(parsedValue.value)[0];
                  } else if (prop.type == 'file') {
                    value = value && this.parseValue(value, { complete: 1 }).value;
                  }

                  return {
                    ...prop,
                    ...value && { value },
                  }
                }),
              ]
            })
          });
        }

        return layers;
      },
    }),
    view: stack.view,
  })
};