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
      connection.end();
      start();
    });
  }

  function start() {
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
    .then(function(answer) {
        connection.query("SELECT * FROM products", function(results) {
        var chosenItem;
        var numberOfUnits;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.selection) {
            chosenItem = results[i];
          }
        }
        // .then(function(answer) {
        //     if (answer.selection === "READY") {
        //       beginPurchase();
        //     } else{
        //       connection.end();
        //     }
        //   });
  }