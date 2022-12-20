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
    const newBook = XLSX.utils.book_new()
    // const ingredientsWorkSheet = XLSX.utils.json_to_sheet()
    // const recipesWorkSheet = XLSX.utils.json_to_sheet()
      
    newBook.Props = {
        Title: "Inventario Gastronómico",
        Subject: "Almacen",
        Author: "Alan Franco - Rafael Martinez",
        CreatedDate: new Date()
    };
    
    // XLSX.utils.book_append_sheet(newBook,ws1,"Inventarios") 
    // XLSX.utils.book_append_sheet(newBook,ws2,"Recetas") 
    // XLSX.utils.book_append_sheet(newBook,ws3,"Ingredientes") 
    
    // var wopts = { bookType:"xlsx", bookSST:false, type:"array"};

    // return {data:newBook, filename:"/InventoryAtlas.xlsx",opts: wopts};
}

/*
function Generate()
{
    let Example = [{
        Name:faker.company.name(),
        Ingredient1:faker.commerce.productName(),
        Ingredient2:faker.commerce.productName(),
        Ingredient3:faker.commerce.productName(),
        Ingredient4:faker.commerce.productName(),
        Ingredient5:faker.commerce.productName(),
        Qty: {t:"n" ,F:"5+5"}
    },{
        Name:faker.company.name(),
        Ingredient1:faker.commerce.productName(),
        Ingredient3:faker.commerce.productName(),
        Ingredient4:faker.commerce.productName(),
        Ingredient5:faker.commerce.productName(),
        Qty: {t:"n" ,v:faker.commerce.price()}
    },{
        Name:faker.company.name(),
        Ingredient1:faker.commerce.productName(),
        Ingredient2:faker.commerce.productName(),
        Ingredient4:faker.commerce.productName(),
        Ingredient5:faker.commerce.productName(),
        Qty: {t:"n" ,v:faker.commerce.price()},
        Qty2: {t:"n" ,v:faker.commerce.price()},
        Qty3: {t:"n" ,v:faker.commerce.price()},
        Qty4: {t:"n" ,f:"5+5"}
    }]
    return Example;
} 
*/