var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "D_yulber1!",
    database: "bamazon_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    // console.table(res);
    afterConnection();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
    //   connection.end();
      start();
    });
  }

  function start(products) {
      inquirer
        .prompt({
            name: "buyOrBuy",
            type: "list",
            message: "WELCOME TO BAMAZON. READY TO BEGIN?",
            choices: ["READY", "Oops, wrong site."]
        })
        .then(function(answer) {
            if (answer.buyOrBuy === "READY") {
              beginPurchase();
            } else{
              connection.end();
            }
          });
  }

function beginPurchase() {
    inquirer
        .prompt([
            {
                name: "selection",
                type: "input",
                message: "Enter the item id you'd like to purchase."
        },
        {
            name: "units",
            type: "input",
            message: "How many units of this item would you like to purchase?"
    }
    ])
    .then(function(answers) {
        var quantityDesired = answers.units;
        var idDesired = answers.selection;
        purchaseFromDatabase(quantityDesired, idDesired);
    });
}

function purchaseFromDatabase(quantityDesired, idDesired) {
    connection.query('SELECT * FROM products WHERE item_id = ' + idDesired, function(err, res) {
        if (err) { console.log(err) };

        if (quantityDesired <= res[0].stock_quantity) {
            //calculate cost
            var totalCost = res[0].price * quantityDesired;
            //inform user
            console.log("We have what you need! I'll have your order right out!");
            console.log("Your total cost for " + quantityDesired + " " + res[0].product_name + " is " + totalCost + ". Thank you for your Business!");
            //update database, minus purchased quantity
            connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + quantityDesired + ' WHERE item_id = ' + idDesired);
        } else {
            console.log("Our apologies. We don't have enough " + res[0].product_name + " to fulfill your order.");
        };
        afterConnection();//recursive shopping is best shopping! Shop till you drop!
    });

};