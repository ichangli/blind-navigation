# arcgis-js-api (Deprecated)

This package is deprecated as of version 4.29 and the final release will be version 4.31.

**Migrate to using the [@arcgis/core](https://developers.arcgis.com/javascript/latest/get-started-npm/#api) ES modules.**

## Features

A minified, unbuilt version of the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/) AMD modules.

For an overview of the SDK, visit the [developer documentation](https://developers.arcgis.com/javascript/latest/key-features/) site.

You can install this package with [npm](https://npmjs.org/) and create your own custom builds. For example, you can use [RequireJS](https://requirejs.org/) or the [Dojo Toolkit](https://dojotoolkit.org/).

## Instructions

Additional instructions and examples are available in the SDK's [Build with AMD modules](https://developers.arcgis.com/javascript/latest/amd-build/) Guide page.

```
npm install arcgis-js-api
```

## TypeScript Typings

The TypeScript type definitions are bundled with the install and there are two ways to include them. The first way is to include a `///` directive in your main TypeScript file:

_main.ts_

```ts
/// <reference types="arcgis-js-api" />
```

Or, add a reference to the declaration file in the `include` of your `tsconfig.json`:

_tsconfig.json_

```json
{
  "include": ["node_modules/arcgis-js-api/index.d.ts", "src/**/*.ts", "src/**/*.tsx"]
}
```

## Requirements

Use of the ArcGIS Maps SDK for JavaScript is subject to [System Requirements](https://developers.arcgis.com/javascript/latest/system-requirements/), and the terms described in the product-specific [Terms of Use.](https://www.esri.com/en-us/legal/terms/product-specific-scope-of-use) Learn more about licensing [here](https://developers.arcgis.com/javascript/latest/licensing/).

## Resources

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)
- [http://blogs.esri.com/esri/arcgis/tag/javascript/](https://blogs.esri.com/esri/arcgis/tag/javascript/)
- [twitter@EsriDevs](https://twitter.com/EsriDevs)

## Issues

- General questions about using these modules or the ArcGIS Maps SDK for JavaScript? See the [Esri developer community](https://community.esri.com/t5/arcgis-api-for-javascript/ct-p/arcgis-api-for-javascript).
- [Technical support](https://support.esri.com/).

## Licensing

COPYRIGHT © 2024 Esri

All rights reserved under the copyright laws of the United States
and applicable international laws, treaties, and conventions.

This material is licensed for use under the [Esri Master License
Agreement (MLA)](https://www.esri.com/content/dam/esrisites/en-us/media/legal/ma-full/ma-full.pdf), and is bound by the terms of that agreement.
You may redistribute and use this code without modification,
provided you adhere to the terms of the MLA and include this
copyright notice.

For additional information, contact:
Environmental Systems Research Institute, Inc.
Attn: Contracts and Legal Services Department
380 New York Street
Redlands, California, USA 92373
USA

email: contracts@esri.com
