const {Router} = require('express');
const route = Router();
const {getIntegrityCode} = require("../modules/integrityCode.js");


route.get("/", (req, res) => {
    const query = req.query;
    
    query.search = query.search ? query.search :"";
    query.pageSize = query.pageSize ? query.pageSize : 10;
    query.pageNumber = query.pageNumber ? query.pageNumber : 0;
    query.order = query.order ? query.order :"ASC";

    const rows = [
        {
            id: "1",
            label: "USA Rivers",
            title: "A basic WFS",
            type: "WFS",
            endpoint: "https://sampleservices.luciad.com/wfs",
            layers: ["usrivers"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "1.2",
            label: "USA States",
            title: "A basic WFS",
            type: "WFS",
            endpoint: "https://sampleservices.luciad.com/wfs",
            layers: ["states"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "2",
            label: "USA Water ways",
            title: "A basic WFS",
            type: "WFS",
            endpoint: "https://sampleservices.luciad.com/wfs",
            layers: ["usrivers"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "3",
            label: "USA states",
            title: "A basic WMS",
            type: "WMS",
            endpoint: "https://sampleservices.luciad.com/wms",
            layers: ["states"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "3.1",
            label: "USA rivers",
            title: "A basic WMS",
            type: "WMS",
            endpoint: "https://sampleservices.luciad.com/wms",
            layers: ["rivers"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "3.2",
            label: "USA rivers + states",
            title: "A basic WMS",
            type: "WMS",
            endpoint: "https://sampleservices.luciad.com/wms",
            layers: ["rivers", "states"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "4",
            label: "Lucerna",
            title: "PANORAMA",
            type: "PANORAMA",
            endpoint: "https://sampledata.luciad.com/data/panoramics/LucernePegasus/cubemap_final.json",
            layers: [],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "5",
            label: "Imagery LA",
            title: "A WMTS",
            type: "WMTS",
            endpoint: "https://sampleservices.luciad.com/wmts",
            layers: ["4ceea49c-3e7c-4e2d-973d-c608fb2fb07e"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "6",
            label: "Lucerna",
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
        {
            id: "7",
            label: "World Elevation",
            title: "Terrain elevation",
            type: "LTS",
            endpoint: "https://sampleservices.luciad.com/lts",
            layers: ["world_elevation_6714a770-860b-4878-90c9-ab386a4bae0f"],
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },        
        {
            id: "8",
            label: "Limerick",
            title: "HSPC Pointcloud",
            type: "HSPC",
            endpoint: "https://trident-lf.luciad.com/hspc/v12/limerick-classification/tree.hspc",            
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },
        {
            id: "9",
            label: "Marseille",
            title: "Mesh Pointcloud",
            type: "MESH",
            endpoint: "https://sampleservices.luciad.com/ogc/3dtiles/marseille-mesh/tileset.json",            
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },        
        {
            id: "10",
            label: "House 3",
            title: "Mesh non georeferenced",
            type: "MESH",
            endpoint: "https://trident-lf.luciad.com/ogc3dtiles/plwl-3/tileset.json",            
            options: {
                requestHeaders: undefined,
                requestParameters: undefined,
                credentials: undefined                                
            }
        },        
        {
            id: "11",
            label: "Pointcloud",
            title: "Pointcloud non georeferenced",
            type: "HSPC",
            endpoint: "https://trident-lf.luciad.com/hspc/office/tree.hspc",
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
    res.json(results);
})


module.exports = route;