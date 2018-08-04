var mysql = require("mysql");
var inquirer = require("inquirer");


//create connection to sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

var productListArr = [];

connection.connect(function (err) {
    if (err) throw err;
    managerStart();
});


//manager start
function managerStart() {
    inquirer.prompt([
        {
            name: "choice1",
            type: "rawlist",
            choices: ["View Products For Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"],
            message: "What Would You Like To Do"
        }
    ]).then(function (answer) {
        switch (answer.choice1) {
            case "View Products For Sale":
                viewProduct();
                break;

            case "View Low Inventory":
                viewInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;
        }

    })
}

function viewProduct() {

    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " | " + "Item: " + res[i].product + " | " + "Price: $" + res[i].price + " | " + "Stock: " + res[i].stockQuantity)
        }

    })
    managerStart();
}

function viewInventory() {

    connection.query("SELECT * FROM items WHERE stockQuantity <= 5", function (err, res) {
        if (err) throw err;
        console.log('LOW INVENTORY')

        for (var i = 0; i < res.length; i++) {
            console.log("Item ID " + res[i].item_id + " | " + "Item: " + res[i].product + " | " + "Stock: " + res[i].stockQuantity);
        }
    });
    managerStart();
}

function addInventory() {
    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "productList",
                type: "list",
                choices: function () {
                    for (var i = 0; i < res.length; i++) {
                        productListArr.push(res[i].product);
                    }
                    return productListArr;
                },
                message: "Add inventory to which product?"
            },
            {
                type: "input",
                name: "addQuan",
                message: "New Quan?"
            }
        ]).then(function (answer) {
            var selectedProduct;
            for (var i = 0; i < res.length; i++) {
                if (res[i].product == answer.productList) {
                    selectedProduct = res[i];
                }
            }
        
            var newQuan = parseFloat(answer.addQuan) + parseFloat(selectedProduct.stockQuantity);
          

            connection.query("UPDATE items SET ? WHERE ?", [{ stockQuantity: newQuan },
            { product: selectedProduct.product }], function (err, res) {
                if (err) throw err;
                console.log("New Quantity " + newQuan + " for " + answer.productList);
                managerStart();
            })
        })
        
    })

}

function addProduct() {

    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "Product Name? "
        },
        {
            name: "department",
            type: "input",
            message: "Department? "
        },
        {
            name: "price",
            type: "input",
            message: "Price? "
        },
        {
            name: "quantity",
            type: "input",
            message: "Quantity?"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO items SET ?", {
            product: answer.product,
            department: answer.department,
            price: answer.price,
            stockQuantity: answer.quantity

        })
        console.log(answer.product + " Has been added");
        connection.end();
    })
}
