import XLSX from 'xlsx';

export const ReadFile = (req,res) =>  
{
    const file = XLSX.readFile('data.xlsx');
    let data = []

    const sheets = file.SheetNames;
    for(let i = 0; i < sheets.length; i++)
    {
       let temp = XLSX.utils.sheet_to_json(file.Sheets[sheets[i]])
       temp.forEach( sheet => {
         data.push(sheet);
       })
    }

    res.json(data);
}

export const WriteFile = (database) => async (req,res) => {
 
    const ingredientsData = await database('ingredientes').select('*').then(data => data);
    const recipesData = await database('recetas').select('*').then(data => data);
    const ingredientsWorkSheet = XLSX.utils.json_to_sheet(ingredientsData);
    const recipesWorkSheet = XLSX.utils.json_to_sheet(recipesData)
    const book = XLSX.utils.book_new()
    const opts = { bookType:"xlsx", bookSST:false, type:"array"};      
    book.Props = {
        Title: "Inventario Gastronómico",
        Subject: "Almacen",
        Author: "Alan Franco - Rafael Martinez",
        CreatedDate: new Date()
    };
    
    XLSX.utils.book_append_sheet(book,ingredientsWorkSheet,"Ingredientes") 
    XLSX.utils.book_append_sheet(book,recipesWorkSheet,"Recetas") 
    
    XLSX.writeFileXLSX(book,'Inventario_Gastronomico.xlsx',opts)
    // console.log(book.Sheets.Recetas.B2);
    res.json('El archivo de excel ha sido creado.');
}