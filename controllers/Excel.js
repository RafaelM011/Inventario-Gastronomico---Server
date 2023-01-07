import XLSX from 'xlsx';
import fs from 'fs';



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
 
    const ingredientsData = await database('ingredientes').select('*').then(data => data);
    const recipesData = await database('recetas')./*where({nombre:"La equina de la doña"}).*/select('*').then(data => data);
    
    const user = 'user_1';
    const filePath = 'TempFiles/'+ user +'.xlsx'; 

    const ingredientsWorkSheet = XLSX.utils.json_to_sheet(ingredientsData);
    const recipesWorkSheet = XLSX.utils.json_to_sheet(recipesData);
    const book = XLSX.utils.book_new();
    const opts = { bookType:"xlsx", bookSST:false, type:"array"};      
    book.Props = {
        Title: "Inventario Gastronómico",
        Subject: "Almacen",
        Author: "Alan Franco - Rafael Martinez",
        CreatedDate: new Date()
    };
    
    XLSX.utils.book_append_sheet(book,ingredientsWorkSheet,"Ingredientes") ;
    XLSX.utils.book_append_sheet(book,recipesWorkSheet,"Recetas") ;
    
    XLSX.writeFileXLSX(book,filePath,opts);
    res.download(filePath);
};

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