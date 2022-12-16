
export const Practice = (database) => (req, res) => {
    const {nombre, costo, xmedida, cantidad, medida, marca} = req.body;
   
    let ingrediente = new Ingredient(nombre, costo, xmedida, cantidad, medida, marca); 
    res.json(ingrediente)
    console.log(ingrediente.GetIngredients())
    // let receta = new Recipe(
    //     req.body.nombre,
    //     req.body.costo,
    //     req.body.xmedida,
    //     req.body.cantidad,
    //     req.body.medida); 
    //     receta.ingredients.push(ingrediente)
    // res.json(receta)

    // database('NOMBRE DE LA TABLA').where('username', 'rafa')
    // .select('')
    // .insert('')
    // .then(data => {"LO QUE SE QUIERE HACER CON LA DATA DEL DATABASE"})

    
} 


class Ingredient {
    constructor(nombre, costo, xmedida, cantidad, medida, marca = "") {
        
        this.nombre = nombre
        this.costo = costo
        this.xmedida = xmedida
        this.cantidad = cantidad
        this.medida = xmedida
        this.marca = marca
    }

    ToString() {
        return (this.nombre + " Price:" + this.costo + "$x " + this.xmedida + " Qty:" + this.cantidad + " " + this.medida)
    }
    ToTable() {
        return [this.nombre, this.costo, this.xmedida, this.cantidad, this.medida];
    }
    ToOBJ(mysucursal = "Default") {
        return {nombre : this.nombre,costo: this.costo,unidad: this.xmedida,cantidad: this.cantidad, Sucursal : mysucursal};
    }
    Instance(instance = null) {
        instance = new Ingredient(this.nombre, this.costo, this.xmedida, this.cantidad, this.medida, this.marca)
        return instance
    }
    GetIngredients() {
        return this
    }
    GetItem(name) {
        if (this.nombre === name) {
            return this
        }
        return null
    }
}

class Recipe extends Ingredient {
    constructor(nombre, costo, xmedida, cantidad, medida, servicios = 1) {
        super(nombre, costo, xmedida, cantidad, medida)
        this.ingredients = []
        this.servings = servicios;
        this.counter = this.servings;
    }

    ToString(txt = "") {
        this.ingredients.forEach(element => {
            txt += "(" + element.ToString() + ")"
        });
        return (this.nombre + " Price:" + this.costo + "$x " + this.xmedida + " Qty:{" + this.cantidad + " " + this.medida + "} Ingredients:[" + txt + "]")
    }
    ToOBJ(mysucursal = "Default") {
        let obj = new Object();
        obj.Ingredients = []
        this.ingredients.forEach(element => {
            obj.ingredients.Push(element.ToOBJ())
        });
        return {nombre : his.nombre,costo: this.costo,unidad: this.xmedida,cantidad: this.cantidad, Sucursal : mysucursal,ingredientes: obj.ingredients} ;
    }
    Instance(instance = null) {
        instance = new Recipe(this.nombre, this.costo, this.xmedida, this.cantidad, this.medida)
        this.ingredients.forEach((element) => {
            instance.ingredients.push(element)
        })
        return instance
    }

    GetIngredients() {
       /* if(this.counter < this.servings)
        {
            this.counter++;
            return;
        }else
        {
            this.counter = 0;
        }*/

        let allIng = new Recipe("Alling",0,"",0,"")
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].constructor.name == "Recipe") {
                let ing = this.ingredients[i].GetIngredients()
                for (let j = 0; j < this.ingredients[i].cantidad; j++) {
                    ing.forEach(element => {
                        allIng.AddItem(element)
                    })
                }

            } else if (this.ingredients[i].constructor.name == "Ingredient") {
                allIng.AddItem(this.ingredients[i])
            }
        }
        return allIng.ingredients;
    }
    GetContent()
    {
        let content = []
        let header = ["Nombre","Ingredientes","Costo","MedidaXprecio","Cantidad","Medida","Marca"]
        content.push(header)
        this.GetIngredients().forEach((element) => {
            content.push([this.nombre,element.nombre,element.costo,element.xmedida,element.cantidad,element.medida,element.marca])
        })

        return content
    }

    GetItem(name) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === name) {
                return this.ingredients[i]
            }
        }
        return null
    }

    GetItemCopy(name) {
        return GetItem(name).Instance()
    }

    AddItem(IngredientToAdd) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].cantidad = parseFloat(IngredientToAdd.cantidad) + parseFloat(this.ingredients[i].cantidad)
                return
            }
        }
        this.ingredients.push(IngredientToAdd.Instance())
    }
    SubItem(IngredientToAdd) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].cantidad = - parseFloat(IngredientToAdd.cantidad) + parseFloat(this.ingredients[i].cantidad)
                return
            }
        }
        IngredientToAdd.cantidad = - IngredientToAdd.Instance().cantidad
        this.ingredients.push(IngredientToAdd.Instance())
    }
    ClearItems() {
        this.ingredients = []
    }

    AddValue(IngredientToAdd) {
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].cantidad = parseFloat(IngredientToAdd.cantidad) + parseFloat(this.ingredients[i].cantidad)

            }
        }
    }
    UpdateItem(IngredientToAdd) {
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i] = IngredientToAdd
                return
            }
        }
    }
    UpdateItemMeasure(IngredientToAdd) {
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].medida = IngredientToAdd.medida
                this.ingredients[i].xmedida = IngredientToAdd.xmedida
                return
            }
        }
    }
    UpdateItemCost(IngredientToAdd) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].costo = IngredientToAdd.costo
                return
            }
        }
    }
}