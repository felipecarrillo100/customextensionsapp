const elementCompanion = document.getElementById("document-companion");
elementCompanion.classList.add("intro-panel");
elementCompanion.classList.add("make-invisible");

window.catex = {}

window.catex.app = {
    onAppReady: () => {
        console.log("App is ready!");
        elementCompanion.classList.remove("make-invisible");
        window.catex.workspace.emitCommand(CommandInitialWorkspace)
    },
    navbarActions: [
        {
            id: "navac-1",
            label: "Open Marseille Layer",
            title: "Trigger an action",
            action: function(o, callback) {
                const command = SampleCommand;
                window.catex.workspace.emitCommand(command);
                callback();
            }
        },       
        {
            id: "navac-2",
            label: "Execute Hello World",
            title: "Trigger an action",
            action: function(o, callback) {
                console.log("Hello world!!!!");
                callback();
            }
        },
        {
            id: "navac-3",
            label: "Alert Hello world",
            title: "Trigger an action",
            action: function(o, callback) {
                alert("Hello world");
                callback();
            }
        },
        {
            id: "navac-4",
            label: "Open Cities",
            title: "Trigger an action",
            action: function(o, callback) {
                alert("Opening cities");
                window.catex.workspace.emitCommand(OpenCitiesCommand)
                callback();
            }
        },
    ],
    webservices: [
        {
            id: "cs1-id",
            label: "Lucerna site",
            title: "A custom service that provides a list assets located in Lucerna",
            action: function(o, callback) {
                if (typeof callback === "function") {
                    const results = localDatasets(o);
                    callback(results);
                }
            }
        },
        {
            id: "cs2-id",
            label: "My company Data",
            title: "A custom services that provides a list of services from REST API",
            action: function(params, callback) {
                if (typeof callback === "function") {
                    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
                    fetch(`http://localhost:5000/api/catalog?${queryString}`)
                    .then(response => response.json())
                    .then(jsonData => {
                        callback(jsonData);
                        })
                    .catch(()=>{
                        callback(null);
                    })     
                }
            }
        }
    ] 
}

elementCompanion.innerHTML = `
    <div class="intro-panel-content center">
      <h2>Custom extensions Demonstrator</h1>
      <p>A Basic sample created to illustrate the use of Catalog Explorer Custom Extensions<p>
      <p>Click on the button to proceed</p>
      <button class="btn btn-sm btn-primary" id="intro-panel-content-button-close" >
            Close
      </button>
    </div>
`;

const closeButton  = document.getElementById("intro-panel-content-button-close");
closeButton.onclick = ()=> {
    elementCompanion.classList.add("make-invisible")
}

window.catex.featureLayer = {
    onFeatureSelect: [
        {
            label: "Double population of 1990",
            title: "Modify properties",
            action: function(o, callback) {
                if (typeof callback === "function") {
                    if (o.feature.properties.POP1990) {
                        const newProperties = {...o.feature.properties, 
                            'POP1990x2': Number(o.feature.properties.POP1990) * 2
                        }
                        callback(newProperties)
                    }                    
                }
            } 
        },
        {
            label: "Get Dog from Rest API",
            title: "Fetch random image from rest API",
            action: function(o, callback) {
                fetch(`http://localhost:5000/api/images/${o.feature.id}`)
                .then(response => response.json())
                .then(jsonData => {
                      callback({
                        ...o.feature.properties, 
                        IMAGE: jsonData.message,
                        VIDEO: 'https://www.youtube.com/watch?v=VAH-ixdFWFs'
                    })
                    })            
            } 
        }
    ]
}

window.catex.ogc3dtiles = {
    onFeatureSelect: [
        {
            label: "Say Hello",
            title: "Modify properties",
            action: function(o, callback) {
                if (typeof callback === "function") {
                    const newProperties = {...o.feature.properties, 
                    greeting: "Hello to Eddie from catexextensions"
                    }
                    callback(newProperties)
                }
            } 
        },
        {
            label: "Modify properties",
            title: "Modify properties",
            action: function(o, callback) {
                if (typeof callback === "function") {
                    const newProperties = {...o.feature.properties, greeting: "Hello from catexcompanion"}
                    callback(newProperties)
                }
            } 
        },
        {
            label: "Print to console",
            title: "Send info to console",
            action: function(o, callback) {
                console.log(o)
            } 
        },
        {
            label: "Fetch from API",
            title: "Fetch from a test API",
            action: function(o, callback) {
                fetch('https://httpbin.org/json')
                .then(response => response.json())
                .then(json => {
                      callback(json.slideshow)
                    })            
            } 
        }
    ] 
}

window.catex.featureLayer.onRender = (layer, feature, style, map, paintState) =>{
   const val = feature.properties.POP1996;
   if (!val) return style;

   const clone = {...style};

   let color;
   const R1=2.5e6;
   const R2=10e6;
   const R3=40e6;

   let r,g,b;
   
    if(val < R1) {
        const perc = val/R1;
        const value = Math.round(255*perc);
        r = 255;
        g = value;
        b = 0;
    } else if(val < R2) {
        var perc = (R2-val)/(R2-R1);
        var value = Math.round(255*perc);
        r = value;
        g = 255;
        b = 0;       
    } else if(val < R3) {
        var perc = (R3-val)/(R3-R2);
        var value = Math.round(255*perc);
        r = 0;
        g = value;
        b = 255;     
    }  
   color = `rgba(${r},${g},${b}, 1)`;    
   if (paintState.selected) {
    color = `rgba(${255-r},${255-g},${255-b}, 1)`;    
    clone.shapeStyle.stroke.color = "rgb(255,0,0)";
   }    
   clone.shapeStyle.fill.color = color;
   return clone;
}

window.catex.data = {
    transformers: [
        {
            name: "CSV",
            extensions: "csv, txt",
            transform: (dataStr) => {
                const arr = CSVToArray(dataStr);
                if (arr.length>1) {
                    const keys = arr[0];
                    const features = [];
                    for(let i=1; i<arr.length;++i) {
                        const properties = {};
                        const values = arr[i];
                        for (let j=0; j<keys.length; ++j) {
                            const key = keys[j];
                            const value = values[j];
                            properties[key]=value;
                        }
                        const feature = {
                            id: i,
                            type: "Feature",
                            properties: properties,
                            geometry: {
                                type:"Point",
                                coordinates: [Number(properties.x), Number(properties.y)]
                            }
                        }
                        features.push(feature);
                    }
                    const featureCollection = {
                        type: "FeatureCollection",
                        features: features
                    }
                    return JSON.stringify(featureCollection);
                }
                return null;
            }
        }
    ] 
}

window.catex.map = {
    onMouseClick:[
        {
            action: function(o, callback) {
                console.log("Mouse click on map:", o);
            } 
        },
   ],
   onMapMove:[
        {
            action: function(o, callback) {
                console.log("Map moved:", o);
            } 
        },
   ],
   onMousePoint:[
        {
            action: function(o, callback) {
                console.log("Mouse moved to:", o);
            } 
        },
   ]
}

function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

function localDatasets(query) {
    const rows = [
        {
            id: "1",
            label: "Lucerna Panoramas",
            title: "PANORAMA",
            type: "PANORAMA",
            endpoint: "https://sampledata.luciad.com/data/panoramics/LucernePegasus/cubemap_final.json",
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "1.2",
            label: "Lucerna Mesh",
            title: "3D Tiles",
            type: "MESH",
            endpoint: "https://sampledata.luciad.com/data/ogc3dtiles/LucerneAirborneMesh/tileset.json",
            layers: [],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
    ]
    const matches = rows.filter(r=>r.label.toLowerCase().indexOf(query.search.toLowerCase())!==-1);
    const pageNumber = Number(query.pageNumber);
    const pageSize = Number(query.pageSize);
    const paginated = matches.sort((a,b)=>a>b?1:a<b?-1:0).slice(pageNumber * pageSize, (pageNumber+1) * pageSize);
    const results = {
        rows: paginated,
        matches: matches.length,
        total: rows.length
    }
    return results;
}

const SampleCommand = {
    "action": 10,
    "parameters": {
      "action": "OGC3DTilesLayer",
      "autozoom": true,
      "layer": {
        "selectable": true,
        "transparency": false,
        "idProperty": "FeatureID",
        "loadingStrategy": 1,
        "label": "/ogc/3dtiles/marseille-mesh",
        "offsetTerrain": false,
        "isDrapeTarget": false,
        "qualityFactor": 1,
        "minScale": null,
        "maxScale": null
      },
      "model": {
        "url": "https://sampleservices.luciad.com/ogc/3dtiles/marseille-mesh/tileset.json",
        "credentials": false,
        "requestHeaders": {},
        "requestParameters": {},
        "beforeProxy": "https://sampleservices.luciad.com/ogc/3dtiles/marseille-mesh/tileset.json",
        "useProxy": false
      }
    }
  }

  const CommandInitialWorkspace = {
    "action": 3,
    "parameters": {
      "workspace": {
        "content": "{\"fileformat\":\"TridentWorkspace\",\"version\":\"1.0\",\"pictureSettings\":{\"saturation\":100,\"brightness\":100,\"contrast\":100,\"sepia\":0,\"grayscale\":0,\"invert\":0,\"enabled\":false},\"ecdisSettings\":{\"colorScheme\":\"day\",\"sounding\":false,\"displayCategory\":\"standard\",\"useTwoShades\":true,\"shallowContour\":2,\"safetyContour\":30,\"deepContour\":30,\"beam\":10,\"airDraft\":10,\"displayIsolatedDangersInShallowWater\":false,\"displayShallowPattern\":false,\"displaySoundings\":false},\"timeManager\":{\"range\":{\"min\":1697451129,\"max\":1697537529},\"interval\":{\"min\":1697490729,\"max\":1697497929},\"step\":1,\"currentTime\":1697494329},\"currentlayer\":\"d24fe2ce-ce0e-4e94-8513-fc30727cf5cd\",\"layertree\":{\"action\":\"root\",\"layer\":{\"label\":\"root\",\"id\":\"d53a1165-5c08-43c7-ad24-5d9cc7b70705\",\"visible\":true,\"labeled\":true,\"treeNodeType\":\"LAYER_GROUP\"},\"nodes\":[{\"action\":\"BingmapsLayer\",\"layer\":{\"label\":\"Bingmaps satellite\",\"id\":\"a9ba178d-256d-42de-9852-0655ed47c68a\",\"parent_id\":\"d53a1165-5c08-43c7-ad24-5d9cc7b70705\",\"visible\":true,\"editable\":false,\"treeNodeType\":\"LAYER_RASTER\"},\"model\":{\"imagerySet\":\"Aerial\",\"useproxy\":true}},{\"action\":\"GridLayer\",\"layer\":{\"label\":\"Grid\",\"id\":\"Grid\",\"parent_id\":\"d53a1165-5c08-43c7-ad24-5d9cc7b70705\",\"visible\":true,\"labeled\":true,\"editable\":false,\"treeNodeType\":\"LAYER_GRID\"}},{\"action\":\"OGC3DTilesLayer\",\"layer\":{\"selectable\":true,\"transparency\":false,\"idProperty\":\"FeatureID\",\"label\":\"Factory\",\"qualityFactor\":0.6,\"loadingStrategy\":1,\"offsetTerrain\":false,\"isDrapeTarget\":false,\"minScale\":null,\"maxScale\":null,\"visualProperties\":{\"currentFilter\":0,\"currentStyle\":0,\"filterActive\":false,\"filters\":[],\"scale\":{\"range\":{\"minimum\":0.4,\"maximum\":2},\"value\":1},\"scalingMode\":{\"value\":0},\"styleActive\":false,\"styles\":[],\"type\":\"PointCloud\"},\"meshStyle\":{\"pbrSettings\":{\"enabled\":false,\"imageBasedLighting\":true,\"directionalLighting\":true,\"lightIntensity\":0,\"material\":{\"metallicFactor\":1,\"roughnessFactor\":1}}},\"id\":\"d24fe2ce-ce0e-4e94-8513-fc30727cf5cd\",\"parent_id\":\"d53a1165-5c08-43c7-ad24-5d9cc7b70705\",\"visible\":true,\"editable\":false,\"treeNodeType\":\"LAYER_OGC3D\"},\"model\":{\"url\":\"https://sampledata.luciad.com/data/ogc3dtiles/outback_PBR_Draco/tileset.json\",\"credentials\":false,\"beforeProxy\":\"https://sampledata.luciad.com/data/ogc3dtiles/outback_PBR_Draco/tileset.json\"}}]},\"projection\":\"EPSG:4978\",\"state\":{\"reference\":\"EPSG:4978\",\"viewSize\":[1920,1031],\"transformation2D\":{\"worldOrigin\":[475254.81776997104,5683680.565177331],\"viewOrigin\":[960,515.5],\"scale\":[142.26749266294303,142.26749266294303],\"rotation\":308.45789101079424},\"transformation3D\":{\"eyePointX\":3986355.573019863,\"eyePointY\":297598.8924680033,\"eyePointZ\":4953377.7138468,\"yaw\":308.4580268536007,\"pitch\":-22.017181098120954,\"roll\":0}},\"workspaceExportOptions\":{\"saveAnnotations\":true,\"removeCredentials\":false}}",
        "filename": "workspace (9).tws",
        "source": "file"
      }
    }
  }

  const OpenCitiesCommand = {
    "action": 10,
    "parameters": {
      "action": "WFSLayer",
      "autozoom": true,
      "fitBounds": {
        "coordinates": [
          -157.80423386786342,
          86.78634273572683,
          21.31724960138882,
          39.86111879722236
        ],
        "reference": "CRS:84"
      },
      "layer": {
        "editable": false,
        "label": "City 125",
        "painterSettings": {},
        "selectable": true,
        "visible": true,
        "minScale": null,
        "maxScale": null,
        "loadingStrategy": "LoadSpatially",
        "maxFeatures": 500
      },
      "model": {
        "generateIDs": false,
        "outputFormat": "json",
        "swapAxes": false,
        "swapQueryAxes": false,
        "serviceURL": "https://sampleservices.luciad.com:443/ogc/wfs/sampleswfs",
        "postServiceURL": "https://sampleservices.luciad.com:443/ogc/wfs/sampleswfs",
        "tmp_reference": "urn:ogc:def:crs:OGC:1.3:CRS84",
        "typeName": "cities",
        "versions": [
          "2.0.0"
        ],
        "useProxy": false,
        "beforeProxy": "https://sampleservices.luciad.com/wfs",
        "credentials": false,
        "requestHeaders": {},
        "methods": [
          "POST"
        ]
      }
    }
  }