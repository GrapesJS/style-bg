import * as styleTypes from './styleTypes';
import loadColorLinear from './colorLinear';

export default (editor, opts = {}) => {
  const options = { ...{
    i18n: {},
    // default options
  },  ...opts };

  const sm = editor.StyleManager;
  const stack = sm.getType('stack');
  const propModel = stack.model;
  const filterType = {
    property: 'filter_type',
    name: 'Type',
    type: 'select',
    defaults: 'sepia',
    full: 1,
    list: [
      { value: 'blur'},
      { value: 'brightness'},
      { value: 'contrast'},
      { value: 'grayscale'},
      { value: 'hue-rotate'},
      { value: 'invert'},
      { value: 'opacity'},
      { value: 'saturate'},
      { value: 'sepia'},
    ],
    ...options.inputFilterType,
  };

  const typeTestGr = {
    property: 'test-gr-1',
    defaults: 'auto-gr1',
  };
  const typeTestGr2 = {
    property: 'test-gr-2',
    defaults: 'auto-gr2',
  };
  const typeTestGr3 = {
    property: 'test-gr-3',
    defaults: 'auto-gr3',
  };

  const splitValues = (values, model) => model.splitValues(values);

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
        result = [ typeTestGr, typeTestGr2, typeTestGr3 ]
        break;
    }

    return result;
  };

  loadColorLinear(editor, sm);
  sm.addType('bg', {
    model: propModel.extend({
      defaults: () => ({
        ...propModel.prototype.defaults,
        detached: 1,
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
        // this._updateLayerProps(layer, typeProp.get('value'));
      },

      handleTypeChange(propType, type) {
        const currLayer = this.getCurrentLayer();
        currLayer && this._updateLayerProps(currLayer, type);
        // console.log({ currLayer, propType, type, props: getPropsByType(type), });
      },

      getLayersFromTarget(target, { resultValue } = {}) {
        const layers = [];
        const layerValues = resultValue || target.getStyle()[this.get('property')];
        const types = layerValues[styleTypes.typeBgKey];

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
                    value = this.parseValue(value, { complete: 1 }).value;
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

        console.log({ resultValue, layers });
        return layers;
      },

      /**
       * The value that will be set on target.
       * For the filter type we only need the
       * filter_strength result
       * @return {string}
       */
      // getFullValue() {
      //   return this.getLayers()
      //     .map(layer => layer.getPropertyAt(1))
      //     .map(prop => prop ? prop.getFullValue() : '')
      //     .join(' ');
      // },
    }),
    view: stack.view,
  })
};