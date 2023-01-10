import XLSX from 'xlsx';
import fs from 'fs';
import { time } from 'console';



export const ReadFile = (req,res) =>  
{
    const file = XLSX.readFile('data.xlsx');
    let data = [];

    const sheets = file.SheetNames;
    for(let i = 0; i < sheets.length; i++)
    {
       let temp = XLSX.utils.sheet_to_json(file.Sheets[sheets[i]]);
       temp.forEach( sheet => {
         data.push(sheet);
       });
    }

    res.json(data);
};

export const WriteFile = (database) => async (req,res) => {
 
    const parameters = req.body.parameters || {};
    const ExcelSheets =  await InventoryDataBase(database,parameters);
    
    const user = 'user_1';
    const filePath = 'TempFiles/'+ user +'.xlsx'; 

    const book = XLSX.utils.book_new();
    const opts = { bookType:"xlsx", bookSST:false, type:"array"};      
    book.Props = {
        Title: "Inventario Gastronómico",
        Subject: "Almacen",
        Author: "Alan Franco - Rafael Martinez",
        CreatedDate: new Date()
    };
    
    for (let i = 0; i < ExcelSheets.length; i++) {
        XLSX.utils.book_append_sheet(book,ExcelSheets[i],"Sheet "+i) ;
    }
    
    XLSX.writeFileXLSX(book,filePath,opts);
    res.download(filePath);
};

async function InventoryDataBase(database,parameters)
{
    let dbSection = 'ingredientes';
    let TempParams = {};
    IngredientFilter(parameters[dbSection],TempParams);
    const ingredientsData = await database(dbSection).where(TempParams).select([dbSection+'.nombre',dbSection+'.unidad']).then(data => data);
    
    const inventoryData = await database(dbSection).where(TempParams).select([dbSection+'.sucursal',dbSection+'.cantidad',dbSection+'.nombre',dbSection+'.precio']).then(data => data);
    
    TempParams = {};
    dbSection = 'recetas';
    RecipeFilter(parameters[dbSection],TempParams);
    const recipesData = await database(dbSection).where(TempParams).select([dbSection+'.sucursal',dbSection+'.nombre',dbSection+'.ingredientes',dbSection+'.cantidades']).then(data => data);
    ExpandIngredients(recipesData);

    const tableData = [ingredientsData,recipesData,inventoryData];
    let tableWorkSheet = [];

    for (let i = 0; i < tableData.length; i++) {
        tableData[i].push({Fecha:{t:'d' ,v:Date.now()}});
        tableWorkSheet.push(XLSX.utils.json_to_sheet(tableData[i]));
    }

    return tableWorkSheet;
}
function IngredientFilter(parameters,TempParams)
{
    const columns = ["precio","sucursal","nombre"];
    columns.forEach(item => {
        AddParameter(item,parameters,TempParams);
    });
}
function RecipeFilter(parameters,TempParams)
{
    const columns = ["sucursal","nombre"];
    columns.forEach(item => {
        AddParameter(item,parameters,TempParams);
    });
}
function ExpandIngredients(Data)
{
    if(Data != undefined)
    for (let j = 0; j < Data.length ; j++) {
        if(Data[j].ingredientes != undefined)
        for (let k = 0; k < Data[j].ingredientes.length && Data[j].cantidades.length; k++) {
            Data[j]["ingrediente "+k] = Data[j].ingredientes[k];
            Data[j]["cantidad "+k] = Data[j].cantidades[k];
        } 
        delete Data[j].ingredientes;
        delete Data[j].cantidades;
    }
}
function AddParameter(itemName,parameters,TempParams)
{
    if(parameters[itemName]) TempParams[itemName] = parameters[itemName];
    //return TempParams;
}

export const ImportingXLSX = (database) => async (req,res)=>  
{
    console.log(req.file.path);
    const file = XLSX.readFile(req.file.path);
    console.log(file);
    
    let data = [];
    const sheets = file.SheetNames;
    for(let i = 0; i < sheets.length; i++)
    {
       let temp = XLSX.utils.sheet_to_json(file.Sheets[sheets[i]]);
       temp.forEach( sheet => {
         data.push(sheet);
       });
    }
    console.log(data);

    res.json(data);
};