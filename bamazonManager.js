var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table3");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    startBamazonManager();
});

var allProducts;
// Function to start Bamazon Manager
function startBamazonManager() {
    console.log("\n=============================================================================\n==================== Welcome to Bamazon Manager ====================\n=============================================================================\n\n\n"
    );
    managerInquirer();
}

// Function to display Manager's Options
function managerInquirer() {
    inquirer
        .prompt([
            {
                name: "managerOptions",
                type: "list",
                message: "Please, select what you would like to do:",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit Bamazon Manager"
                ]
            }
        ])
        .then(function (answer) {
            switch (answer.managerOptions) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add to Inventory":
                    addToInvent();
                    break;
                case "Add New Product":
                    addNewProd();
                    break;
                case "Exit Bamazon Manager":
                    exitfunc();
                    break;
            }
        })
}

// Function to display all products
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) console.log(err);
        console.log("\n==================== Here is the list of the available products at the moment ====================\n");
        var table = new Table({
            head: ["Item ID", "Product Name", "Dpt. Name", "Price ($)", "Stock Qty"],
        })
        for (i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(table.toString());
        managerInquirer();
    }
    )
}

// Function to display products with low inventory
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) console.log(err);
            console.log("\n==================== Here is the list of products with low inventory ====================\n");
            var table = new Table({
                head: ["Item ID", "Product Name", "Dpt. Name", "Price ($)", "Stock Qty"],
            })
            for (i = 0; i < res.length; i++) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
                )
            }
            console.log(table.toString());
            console.log("\n=========================================================================================\n");
            managerInquirer();
        }
    )
}

// Function to add inventory to a product
function addToInvent() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            allProducts = res;
            if (err) console.log(err);
            var table = new Table({
                head: ["Item ID", "Product Name", "Dpt. Name", "Price ($)", "Stock Qty"],
            })
            for (i = 0; i < res.length; i++) {
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
                )
            }
            console.log(table.toString());
            inquirer
                .prompt([
                    {
                        name: "item",
                        type: "input",
                        message: "What is the ID of the item you would like to add more stock?",
                        validate: function (value) {
                            if (isNaN(value) === false && value) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "What is the added quantity to this item's stock?",
                        validate: function (value) {
                            if (isNaN(value) === false && value) {
                                return true;
                            }
                            return false;
                        }
                    }
                ])
                .then(function (answer) {
                    var parsedQuantity = parseInt(answer.quantity);
                    var parsedItem = parseInt(answer.item);
                    var updatedStock = allProducts[parsedItem - 1].stock_quantity + parsedQuantity;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedStock
                            },
                            {
                                item_id: parsedItem
                            }
                        ],
                        function (err) {
                            if (err) console.log(err);
                            console.log("\n==================== The inventory was actualized successfully! ====================\n");
                            managerInquirer();
                        }
                    )
                })
        }
    )

}


// Function to add a new product
function addNewProd() {
    console.log("\n==================== Please, enter your product details ====================\n");
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the product you would like to add?"
            },
            {
                name: "dept",
                type: "input",
                message: "What is the department of the product you would like to add?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the product you would like to add?",
                validate: function (value) {
                    if (isNaN(value) === false && value) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "stock",
                type: "input",
                message: "What is the stock quantity of the product you would like to add?",
                validate: function (value) {
                    if (isNaN(value) === false && value) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.dept,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) console.log(err);
                    console.log("\n==================== Your product was added successfully! ====================\n");
                    managerInquirer();
                }
            );
        });
}

function exitfunc() {
    console.log("\n==================== You successfully exit Bamazon Manager ====================\n");
    connection.end();
    return false;
}