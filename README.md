# CatalogExplorer Custom Extension kitchen sink sample

This sample illustrates all the functionalities currently supported by Catalog Explorer Custom extension.

This code is writen in NodeJS using express. 
It hosts the two CDN files for Catalog Explorer Custom Extensions Javascript and CSS files.


## To install
```
npm install
```

## To Run
```
npm start
```

## To use
Once running you need to configure CatalogExplorer custom extensions to retrive the Javascript and CSS from these locations:

JavaScript (CDN):
```
http://localhost:5000/customextensions/index.js
```

CSS (CDN):
```
http://localhost:5000/customextensions/index.css
```

### Optional (integrity code calculation)
If you want to inforce the integrity codes you can sue the rest api provided by this app to generate the integrity codes. For this you can request the values using any browser:
```
http://localhost:5000/api/integrity/customextensions/index.js

http://localhost:5000/api/integrity/customextensions/index.css
```



