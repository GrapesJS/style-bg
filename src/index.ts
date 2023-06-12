import type { Plugin } from 'grapesjs';
import styleGradient, { GRAD_DIRS, GRAD_TYPES, PluginOptions as StyleGradientOptions, getValidDir, parseGradient, toGradient } from 'grapesjs-style-gradient';

export interface PluginOptions {
  /**
   * Options for the `grapesjs-style-gradient` plugin.
   * @default {}
   */
  styleGradientOpts?: StyleGradientOptions,

  /**
   * Extend single style property definition of the plugin.
   * You can, for example, change the default gradient color.
   */
  propExtender?: (prop: any) => any,
};

export enum BackgroundType {
 Image = 'image',
 Color = 'color',
 Grad = 'grad',
};

const getOptions = (items: string[]) => items.map(item => ({ id: item }));

const capitalize = (str: string) => {
  return str && str.charAt(0).toUpperCase() + str.substring(1);
};

const getLayerFromBgImage = (imagePart: string) => {
  const result: Record<string, any> = {
    [PROPERTY_BG_TYPE]: BackgroundType.Image,
  };

  if (imagePart.indexOf('url(') > -1) {
    // Background is Image
    result[PROPERTY_BG_IMAGE] = imagePart;
  } else if (imagePart.indexOf('gradient(') > -1) {
    const parsed = parseGradient(imagePart);
    const { stops } = parsed;

    if (
      stops.length === 2
      && parsed.type === 'linear'
      && (stops[0].color === stops[1].color)
    ) {
      // Background is Color
      result[PROPERTY_BG_TYPE] = BackgroundType.Color;
      result[PROPERTY_BG_COLOR] = stops[0].color;
    } else {
      // Background is Gradient
      const gradDir = getValidDir(parsed.direction) || GRAD_DIRS[0];
      const gradType = parsed.type || GRAD_TYPES[0];
      result[PROPERTY_BG_TYPE] = BackgroundType.Grad;
      result[PROPERTY_BG_GRAD] = toGradient(gradType, gradDir, parsed.colors);
      result[PROPERTY_BG_GRAD_TYPE] = gradType;
      result[PROPERTY_BG_GRAD_DIR] = gradDir;
    }
  }
  return result;
};

const bgTypeIconAttrs = 'style="max-height: 16px; display: block; margin: 0 auto" viewBox="0 0 24 24"';
const PROPERTY_IMAGE = 'background-image';
const PROPERTY_BG_TYPE = '__background-type';
const PROPERTY_BG_IMAGE = PROPERTY_IMAGE;
const PROPERTY_BG_COLOR = `${PROPERTY_BG_IMAGE}-color`;
const PROPERTY_BG_GRAD = `${PROPERTY_BG_IMAGE}-gradient`;
const PROPERTY_BG_GRAD_DIR = `${PROPERTY_BG_GRAD}-dir`;
const PROPERTY_BG_GRAD_TYPE = `${PROPERTY_BG_GRAD}-type`;


const DEFAULT_IMAGE = 'none';

const plugin: Plugin<PluginOptions> = (editor, opts = {}) => {
  const options: PluginOptions = {
    styleGradientOpts: {},
    propExtender: p => p,
    ...opts,
  };

  styleGradient(editor, {
    colorPicker: 'default',
    ...options.styleGradientOpts,
  });

  const onBgTypeChange = ({ property, to }: any) => {
    const newTypeValue = to.value;

    // Hide style properties based on selected type
    if (newTypeValue) {
      property.getParent().getProperties().forEach((prop: any) => {
        const propName = prop.getName();
        let visible = false;
        // Background type is always visible
        if (propName === PROPERTY_BG_TYPE) return;

        if (
          (
            newTypeValue === BackgroundType.Image &&
            [PROPERTY_BG_COLOR, PROPERTY_BG_GRAD, PROPERTY_BG_GRAD_DIR, PROPERTY_BG_GRAD_TYPE].indexOf(propName) < 0
          )
          || (
            newTypeValue === BackgroundType.Color && propName === PROPERTY_BG_COLOR
          )
          || (
            newTypeValue === BackgroundType.Grad &&
            [PROPERTY_BG_GRAD, PROPERTY_BG_GRAD_DIR, PROPERTY_BG_GRAD_TYPE].indexOf(propName) >= 0
          )
        ) {
          visible = true;
        }

        prop.up({ visible });
      });
    }
  };

  editor.Styles.addBuiltIn('background', {
    type: 'stack',
    // @ts-ignore
    layerSeparator: /(?<!\(.*[^)]),(?![^(]*\))/,
    layerJoin: ', ',
    detached: true,
    layerLabel: (l: any, { values, property }: any) => {
      const opt = property.getProperty(PROPERTY_BG_TYPE).getOption(values[PROPERTY_BG_TYPE]);
      return opt?.title ? `${capitalize(opt.title)}` : '';
    },
    fromStyle(style: Record<string, string>, { property, name }: any) {
      const sep = property.getLayerSeparator();
      const props = property.getProperties();
      let layers: any = [];

      if (style[PROPERTY_IMAGE]) {
        // Get layers from the `background-image` property
        layers = property.__splitStyleName(style, PROPERTY_IMAGE, sep).map(getLayerFromBgImage);

        // Update layers by inner properties
        props.forEach((prop: any) => {
          const id = prop.getId();
          const propName = prop.getName();
          if (propName === PROPERTY_IMAGE) return;
          property.__splitStyleName(style, propName, sep)
            .map((value: string) => ({ [id]: value || prop.getDefaultValue() }))
            .forEach((inLayer: any, i: number) => {
              layers[i] = layers[i] ? { ...layers[i], ...inLayer } : inLayer;
            });
        });
      } else if (style[name]) {
        // Partial support for the `background` property
        layers = property.__splitStyleName(style, name, /(?![^)(]*\([^)(]*?\)\)),(?![^\(]*\))/)
          .map((value: string) => value.substring(0, value.lastIndexOf(')') + 1))
          .map(getLayerFromBgImage);
      }

      return layers;
    },
    toStyle(newValues: Record<string, string>) {
      const values = { ...newValues };
      const type = values[PROPERTY_BG_TYPE];
      let image = values[PROPERTY_BG_IMAGE];

      if (type === BackgroundType.Color) {
        const bgColor = values[PROPERTY_BG_COLOR];
        image = bgColor === DEFAULT_IMAGE ? DEFAULT_IMAGE : `linear-gradient(${bgColor} 0%, ${bgColor} 100%)`;
      } else if (type === BackgroundType.Grad) {
        const parsed = parseGradient(values[PROPERTY_BG_GRAD] || '');
        image = toGradient(
          values[PROPERTY_BG_GRAD_TYPE] || GRAD_TYPES[0],
          values[PROPERTY_BG_GRAD_DIR] || GRAD_DIRS[0],
          parsed.colors
        );
      }

      delete values[PROPERTY_BG_IMAGE];
      delete values[PROPERTY_BG_COLOR];
      delete values[PROPERTY_BG_GRAD];
      delete values[PROPERTY_BG_GRAD_DIR];
      delete values[PROPERTY_BG_GRAD_TYPE];

      return {
        ...values,
        'background-image': image || DEFAULT_IMAGE,
      };
    },
    properties: [
      {
        label: ' ',
        property: PROPERTY_BG_TYPE,
        type: 'radio',
        default: BackgroundType.Image,
        onChange: onBgTypeChange,
        options: [
          {
            id: BackgroundType.Image,
            title: 'Image',
            label: `<svg ${bgTypeIconAttrs}><path fill="currentColor" d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5m16 1V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z"/></svg>`,
          },
          {
            id: BackgroundType.Color,
            title: 'Color',
            label: `<svg ${bgTypeIconAttrs}><path fill="currentColor" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>`,
          },
          {
            id: BackgroundType.Grad,
            title: 'Gradient',
            label: `<svg ${bgTypeIconAttrs}><path fill="currentColor" d="M11 9h2v2h-2V9m-2 2h2v2H9v-2m4 0h2v2h-2v-2m2-2h2v2h-2V9M7 9h2v2H7V9m12-6H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2M9 18H7v-2h2v2m4 0h-2v-2h2v2m4 0h-2v-2h2v2m2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z"/></svg>`,
          },
        ],
      },
      {
        label: 'Image',
        property: PROPERTY_BG_IMAGE,
        default: 'none',
        functionName: 'url',
        type: 'file',
        full: true,
      },
      {
        property: 'background-repeat',
        default: 'repeat',
        type: 'select',
        options: [
          { id: 'repeat', label: 'Repeat' },
          { id: 'repeat-x', label: 'Repeat x' },
          { id: 'repeat-y', label: 'Repeat y' },
          { id: 'no-repeat', label: 'No repeat' },
          { id: 'space', label: 'Space' },
          { id: 'round', label: 'Round' },
        ]
      },
      {
        property: 'background-position',
        default: 'left top',
        type: 'select',
        options: getOptions([
          'left top',
          'left center',
          'left bottom',
          'right top',
          'right center',
          'right bottom',
          'center top',
          'center center',
          'center bottom',
        ]),
      },
      {
        property: 'background-attachment',
        default: 'scroll',
        type: 'select',
        options: getOptions(['scroll', 'fixed', 'local']),
      },
      {
        type: 'select',
        default: 'auto',
        property: 'background-size',
        options: getOptions(['auto', 'cover', 'contain']),
      },
      {
        label: 'Color',
        property: PROPERTY_BG_COLOR,
        default: 'none',
        type: 'color',
        full: true,
      },
      {
        label: 'Gradient',
        property: PROPERTY_BG_GRAD,
        default: 'linear-gradient(right, black 0%, white 100%)',
        type: 'gradient',
        full: true,
      },
      {
        name: 'Direction',
        property: PROPERTY_BG_GRAD_DIR,
        type: 'select',
        default: 'right',
        options: getOptions(GRAD_DIRS),
      },
      {
        name: 'Type',
        property: PROPERTY_BG_GRAD_TYPE,
        default: 'linear',
        type: 'select',
        options: getOptions(GRAD_TYPES),
      }
    ].map(prop => options.propExtender?.(prop) || prop)
  });
};

export default plugin;