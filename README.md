# Grapesjs Style Bg

Full-stack background style property type for GrapesJS, with the possibility to add images, colors, and gradients.

> Requires GrapesJS v0.20.1 or higher

![gradient-prv](https://user-images.githubusercontent.com/11614725/77124488-461ed400-6a43-11ea-9cc5-f80bd3729ef3.jpg)

[DEMO](https://codepen.io/artf/pen/GRGXdYe)

## Summary

* Plugin name: `grapesjs-style-bg`
* This plugin updates the built-in `background` style property.



## Options

| Option | Description | Default |
|-|-|-
| `styleGradientOpts` | Options for the `grapesjs-style-gradient` plugin  | `{}` |
| `propExtender` | Extend single style property definition of the `background` property. | `prop => prop` |



## Download

* CDN
  * `https://unpkg.com/grapesjs-style-bg`
* NPM
  * `npm i grapesjs-style-bg`
* GIT
  * `git clone https://github.com/GrapesJS/style-bg.git`



## Usage

Directly in the browser (remember to include the [Grapick](https://github.com/artf/grapick) CSS)
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<link href="https://unpkg.com/grapick/dist/grapick.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-style-bg.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-style-bg'],
      pluginsOpts: {
        'grapesjs-style-bg': { /* options */ }
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-style-bg';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapick/dist/grapick.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/GrapesJS/style-bg.git
$ cd grapesjs-style-bg
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT
