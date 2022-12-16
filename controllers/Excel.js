import XLSX from 'xlsx';

export const ReadFile = (req,res) =>  
{
    const file = XLSX.readFile('data.xlsx');
  
    let data = []
      
    const sheets = file.SheetNames;
    for(let i = 0; i < sheets.length; i++)
    {
       const temp = XLSX.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
       temp.forEach((res) => {
          data.push(res)
       })
    }
    console.log(data);
}

// function WriteFile(file = null,file2 = null,file3 = null)
// {
//     if(!file){file = Generate()}
 
//     const ws1 = XLSX.utils.json_to_sheet(file)
//     const ws2 = XLSX.utils.json_to_sheet(file2)
//     const ws3 = XLSX.utils.json_to_sheet(file3)
      
//     const newBook = XLSX.utils.book_new()

//     newBook.Props = {
//         Title: "Formato Inventario Gastronómico",
//         Subject: "Almacen",
//         Author: "Alan Franco - Rafael Martinez",
//         CreatedDate: new Date(2022, 11, 25)
//     };
    
//     XLSX.utils.book_append_sheet(newBook,ws1,"Inventarios") 
//     XLSX.utils.book_append_sheet(newBook,ws2,"Recetas") 
//     XLSX.utils.book_append_sheet(newBook,ws3,"Ingredientes") 
    
//     var wopts = { bookType:"xlsx", bookSST:false, type:"array"};

//     return {data:newBook, filename:"/InventoryAtlas.xlsx",opts: wopts};
// }

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