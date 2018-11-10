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
    startBamazon();
});

function startBamazon() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("\n=============================================================================\n==================== Please check our available products ====================\n=============================================================================\n");
        var table = new Table({
            head: ["Item ID", "Product Name", "Dpt. Name", "Price ($)", "Stock Qty"],
        })
        for (i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(table.toString());
        console.log("\n=============================================================================\n==================== Feel free to buy whatever you need! ====================\n=============================================================================\n");
        productInquirer();
        function productInquirer() {
            inquirer
                .prompt([
                    {
                        name: "item",
                        type: "input",
                        message: "What article would you like to buy? (please enter the Item ID)",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "How many pieces of that item do you want to buy?",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    }
                ])
                .then(function (answer) {
                    var item = parseInt(answer.item, 10);
                    var quantity = parseInt(answer.quantity, 10);
                    if (quantity > res[item - 1].stock_quantity) {
                        console.log("\n====================================================================================\nYou want " + quantity + " " + res[item - 1].product_name + "(s)" + " but, unfortunately, the maximum available is only " + res[item - 1].stock_quantity + "!\n====================================================================================\n");
                        shoppingInquirer();
                        function shoppingInquirer() {
                            inquirer
                                .prompt([
                                    {
                                        name: "exit",
                                        type: "list",
                                        message: "Do you want to continue shopping?",
                                        choices:
                                            [
                                                "Yes, I would like to continue shopping!",
                                                "No! Please, kick me out of here!"
                                            ]
                                    },
                                ])
                                .then(function (answer) {
                                    switch (answer.exit) {
                                        case "Yes, I would like to continue shopping!":
                                            productInquirer();
                                            break;

                                        case "No! Please, kick me out of here!":
                                            connection.end();
                                            return false;
                                    }
                                })
                        }
                    }

                    else {
                        var updatedStock = res[item - 1].stock_quantity - quantity;
                        connection.query(
                            "UPDATE products SET ?  WHERE ?",
                            [
                                {
                                    stock_quantity: updatedStock
                                },
                                {
                                    item_id: item
                                }
                            ],
                            
                            function (error, response) {
                                if (error) {
                                    console.log(error);
                                    return;
                                }
                                var totalPrice = res[item - 1].price * quantity;
                                console.log("\n====================================================================================\nYou have successfully bought " + quantity + " " + res[item - 1].product_name + "(s) for the total price of $" + totalPrice + " USD!\n====================================================================================\n");
                                shoppingInquirer2();
                            }
                        );

                        function shoppingInquirer2() {
                            inquirer
                                .prompt([
                                    {
                                        name: "exit",
                                        type: "list",
                                        message: "Do you want to continue shopping?",
                                        choices:
                                            [
                                                "Yes, I would like to continue shopping!",
                                                "No! Please, kick me out of here!"
                                            ]
                                    },
                                ])
                                .then(function (answer) {
                                    switch (answer.exit) {
                                        case "Yes, I would like to continue shopping!":
                                            startBamazon();
                                            break;

                                        case "No! Please, kick me out of here!":
                                            connection.end();
                                            return false;
                                    }
                                })
                        }
                    }

                })
        }
    })
}