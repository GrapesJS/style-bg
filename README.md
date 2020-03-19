# Grapesjs Style Bg

Full stack background style property type for GrapesJS, with the possibility to add images, colors and gradients.

![gradient-prv](https://user-images.githubusercontent.com/11614725/77124488-461ed400-6a43-11ea-9cc5-f80bd3729ef3.jpg)

[DEMO](https://grapesjs.com/demo.html)

## Summary

* Plugin name: `grapesjs-style-bg`
* Style Manager properties
    * `bg` The main background type
    * `color-linear` Like a simple color picker but with the output compatible with `background-image`



## Options

| Option | Description | Default |
|-|-|-
| `option1` | Description option | `default value` |



## Download

* CDN
  * `https://unpkg.com/grapesjs-style-bg`
* NPM
  * `npm i grapesjs-style-bg`
* GIT
  * `git clone https://github.com/artf/grapesjs-style-bg.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
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
$ git clone https://github.com/artf/grapesjs-style-bg.git
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
