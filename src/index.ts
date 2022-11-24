import type grapesjs from 'grapesjs';
// @ts-ignore
import styleGradient from 'grapesjs-style-gradient';
import * as styleTypesAll from './styleTypes';
import loadColorLinear from './colorLinear';
import { typeBgKey } from './utils';

export interface PluginOptions {
  /**
   * Options for the `grapesjs-style-gradient` plugin.
   * @default {}
   */
  styleGradientOpts?: Record<string, any>,

  /**
   * Extend single style property definition of the plugin.
   * You can, for example, change the default gradient color.
   */
  propExtender?: (prop: any) => any,

  /**
   * Use this function to change/add/extend style properties for each BG type.
   */
  typeProps?: (prop: any, type: string) => any,
};

const plugin: grapesjs.Plugin<PluginOptions> = (editor, opts = {}) => {
  const options: PluginOptions = {
    styleGradientOpts: {},
    propExtender: p => p,
    typeProps: p => p,
    ...opts,
  };

  let styleTypes = { ...styleTypesAll };
  const sm = editor.StyleManager;
  const stack = sm.getType('stack');
  const propModel = stack.model;
  styleTypes = Object.keys(styleTypes).reduce((acc, item) => {
    // @ts-ignore
    const prop = styleTypes[item];
    acc[item] = options.propExtender?.(prop) || prop;
    return acc;
  }, {} as any);
  const getPropsByType = (type: string) => {
    let result: any = [
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

    return options.typeProps?.(result, type) || result;
  };

  styleGradient(editor, {
    colorPicker: 'default',
    ...options.styleGradientOpts,
  });
  loadColorLinear(editor);
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
          ...getPropsByType(''),
        ],
      }),

      init() {
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.listenTo(this.getLayers(), 'add', this.onNewLayerAdd);
      },

      _updateLayerProps(layer: any, type: string) {
        const props = layer.get('properties');
        props.remove(props.filter((it: any, id: number) => id !== 0));
        getPropsByType(type).forEach((item: string) => props.push(item))
      },

      /**
       * On new added layer we should listen to filter_type change
       * @param  {Layer} layer
       */
      onNewLayerAdd(layer: any) {
        const typeProp = layer.getPropertyAt(0);
        layer.listenTo(typeProp, 'change:value', this.handleTypeChange)
      },

      handleTypeChange(propType: any, type: string, opts: any) {
        const currLayer = this.getCurrentLayer();
        currLayer && this._updateLayerProps(currLayer, type);
        opts.fromInput && this.trigger('updateValue');
      },

      getLayersFromTarget(target: any, { resultValue }: any = {}) {
        const layers: any[] = [];
        const layerValues = resultValue || target.getStyle()[this.get('property')];
        const types = layerValues[typeBgKey];
        if (types) {
          this.splitValues(types).forEach((type: string, idx: number) => {
            const props = getPropsByType(type);
            layers.push({
              properties: [
                { ...styleTypes.typeBg, value: type },
                ...props.map((prop: any) => {
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

export default plugin;