var mysql = require("mysql");
var inquirer = require("inquirer");
var cost;
//create connection to sql database
var connection = mysql.createConnection({
    host: "localhost"
    ,
    //port
    port: 3306,

    //username
    user: "root",

    //password
    password: "root",
    database: "bamazon_DB"
});

//connect to mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    start();
})


//start function 
function start() {
    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log("Product: " + res[i].product + " Price: $" + res[i].price);
        }

        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var itemArray = [];
                    for (var i = 0; i < res.length; i++) {
                        itemArray.push(res[i].product);
                    }
                    return itemArray;
                },
                message: "What would you like to purchase?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many?"
            }
        ])
            .then(function (answer) {
                //get info of item
                var selectedProduct;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product == answer.choice) {
                        selectedProduct = res[i];
                    }
                }
                cost = selectedProduct.price * answer.quantity;
                var newQuantity = selectedProduct.stockQuantity - answer.quantity;

                //determines if enough in stock


                if (selectedProduct.stockQuantity > answer.quantity) {
                    //enough in stock, update db, let user know, and start over
                    //FIX WHERE ? NOT DEFINED
                    connection.query(
                        "UPDATE items SET ? WHERE ?",
                        [{ stockQuantity: newQuantity }, { product: selectedProduct.product }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log("Purchase made!");
                            console.log("$" + cost);
                            connection.end();
                        }
                    );

                }
                else {
                    //not enough in stock
                    console.log("Your order cannot be fulfilled at this time.");

                }
            });
    });
}