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
  const typeBg = {
    name: ' ',
    property: 'bg-type',
    type: 'radio',
    defaults: 'img',
    options: [
      { value: 'img' },
      { value: 'color' },
      { value: 'grad' },
    ],
  };
  const typeImage = {
    property: 'background-image',
    type: 'file',
    functionName: 'url',
  };
  const typeBgRepeat = {
    property: 'background-repeat',
    type: 'select',
    defaults: 'repeat',
    options: [
      { value: 'repeat' },
      { value: 'repeat-x' },
      { value: 'repeat-y' },
      { value: 'no-repeat' }
    ],
  };
  const typeBgPos = {
    property: 'background-position',
    type: 'select',
    defaults: 'left top',
    options: [
      { value: 'left top' },
      { value: 'left center' },
      { value: 'left bottom' },
      { value: 'right top' },
      { value: 'right center' },
      { value: 'right bottom' },
      { value: 'center top' },
      { value: 'center center' },
      { value: 'center bottom' }
    ],
  };
  const typeBgAttach = {
    property: 'background-attachment',
    type: 'select',
    defaults: 'scroll',
    options: [
      { value: 'scroll' },
      { value: 'fixed' },
      { value: 'local' }
    ],
  };
  const typeBgSize = {
    property: 'background-size',
    type: 'select',
    defaults: 'auto',
    options: [
      { value: 'auto' },
      { value: 'cover' },
      { value: 'contain' }
    ],
  };


  const typeTestImg = {
    property: 'test-img-1',
  };
  const typeTestCol = {
    property: 'test-color-1',
  };
  const typeTestCol2 = {
    property: 'test-color-2',
  };
  const typeTestGr = {
    property: 'test-gr-1',
  };
  const typeTestGr2 = {
    property: 'test-gr-2',
  };
  const typeTestGr3 = {
    property: 'test-gr-3',
  };

  const getPropsByType = type => {
    let result = [
      typeTestImg,
    ];

    switch (type) {
      case 'color':
        result = [ typeTestCol, typeTestCol2 ]
        break;
      case 'grad':
        result = [ typeTestGr, typeTestGr2, typeTestGr3 ]
        break;
    }

    return result;
  };

  sm.addType('bg', {
    model: propModel.extend({
      defaults: () => ({
        ...propModel.prototype.defaults,
        properties: [
          typeBg,
          typeTestImg,
        ],
      }),

      init() {
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.listenTo(this.getLayers(), 'add', this.onNewLayerAdd);
      },

      /**
       * On new added layer we should listen to filter_type change
       * @param  {Layer} layer
       */
      onNewLayerAdd(layer) {
        console.log('onNewLayerAdd');
        const typeProp = layer.getPropertyAt(0);
        layer.listenTo(typeProp, 'change:value', this.handleTypeChange)
      },

      handleTypeChange(propType, type) {
        const currLayer = this.getCurrentLayer();
        // const strProps = this.getStrengthPropsByType(functionName);
        // propType.collection.at(1).set(strProps);
        if (currLayer) {
          //currLayer && currLayer.get('properties').reset(getPropsByType(type));
          const props = currLayer.get('properties');
          props.remove(props.filter((it, id) => id !== 0));
          props.push(getPropsByType(type));
          console.log('After change', props.length);
        }
        console.log({ currLayer, propType, type, props: getPropsByType(type), });
      },

      getLayersFromTarget(target, { resultValue } = {}) {
        const layers = [];
        const layerValues = resultValue || target.getStyle()[this.get('property')];

        layerValues && layerValues.split(' ').forEach(layerValue => {
          const parserOpts = { complete: 1, numeric: 1 };
          const { value, unit, functionName } = this.parseValue(layerValue, parserOpts);
          layers.push({
            properties: [
              { ...filterType, value: functionName },
              { ...filterStrength,
                ...this.getStrengthPropsByType(functionName), value, unit },
            ]
          })
        });

        return layers;
      },

      getStrengthPropsByType(functionName) {
        let unit = '%';
        let units = ['%'];
        let max = 100;

        switch (functionName) {
          case 'blur':
            unit = 'px';
            units = ['px'];
            break;
          case 'hue-rotate':
            unit = 'deg';
            units = ['deg'];
            max = 360;
            break;
        }

        const result = {
            functionName,
            unit,
            units,
            max,
        };

        return result;
      },

      /**
       * The value that will be set on target.
       * For the filter type we only need the
       * filter_strength result
       * @return {string}
       */
      getFullValue() {
        return this.getLayers()
          .map(layer => layer.getPropertyAt(1))
          .map(prop => prop ? prop.getFullValue() : '')
          .join(' ');
      },
    }),
    view: stack.view,
  })
};