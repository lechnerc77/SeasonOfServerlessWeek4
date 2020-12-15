# Season of Serverless - Challenge Week 4

This repository contains the solution for the Season of Serverless Challenge week 4 aka "A Big Barbecue!" via Azure Functions in JavaScript

## Solution Components

The solution is a Azure Function that provides a GET endpoint. Based on the query parameter `budget` (which is the available budget for the BBQ in € ) the function calculates:

* The overall number of guests
* The number of male guests
* The number of female guests
* The distribution of different dishes

## Internal Design

The provided Excel file of the challenge (see [Challenge 4: A Big Barbecue!](https://github.com/microsoft/Seasons-of-Serverless/blob/main/Dec-14-2020.md)) has as basic assumption that there is a difference with respect to the meat consumption based on the gender of the guest i. e. female guests consume less meat than male guests. The challenge proposes to optimize the number of guests, so the easiest way to do that is to invite only female guests and serve just garlic bread - this will not be a big hit for a BBQ.

Consequently, this solution puts a bit of modeling before calculation the optimized solution:

1. We assume some prices with the respective units as given here:

   ```javascript
   const beefPrice = 12 //€ per kg
   const filletPrice = 32 //€ per kg
   const sausagesPrice = 1.5 //€ per piece | 12 € per kg 
   const chickenPrice = 15 //€ per kg
   const grilledCheesePrice = 2 //€ per piece
   const garlicBreadPrice = 1 //€ per piece
   ```

2. We put together some menus with the ingredients which gives us different costs depending on the ingredients and the amount of ingredients. We try to serve 400g meat per male guest and 300g meat or chicken for female guests. One example is

   ```javascript
   // Menu 1 - a bit beef, a few sausages
   const menu1Beef = +(beefPrice * 0.25).toFixed(2)
   const menu1Fillet = +(filletPrice * 0).toFixed(2)
   const menu1Sausage = +(sausagesPrice * 3).toFixed(2)
   const menu1Chicken =  +(chickenPrice * 0).toFixed(2)
   const menu1GrilledCheese = grilledCheesePrice * 1
   const menu1GarlicBread = garlicBreadPrice * 2
   ```

For the details of the other menus, please check the source code in `index.js`.

With this information we need to execute an optimization of the problem i. e. to maximize the number of guests. To do so we use the method of [linear optimization](https://en.wikipedia.org/wiki/Linear_programming). Here we use the implementation provided by the npm package `javascript-lp-solver`.

We want to be fair and execute a separate optimization for male and female guests, so we split the budget equally. In order to do so we add some constraints in addition to the maximum budget with respect to maximum amount of money we want to spend on meat and chicken ingredients that we want to spend our budget on. For the male guest optimization model I chose:

```javascript
"constraints": {
                "cost": {"max": budgetMax}, 
                "beef": {"max": +(budgetMax * 0.4).toFixed(2)},
                "fillet": {"max": +(budgetMax * 0.25).toFixed(2)},
                "sausage": {"max": +(budgetMax * 0.5).toFixed(2)},
                "chicken": {"max": +(budgetMax * 0.4).toFixed(2)},
            }
```

For the female guest optimization model I chose 

```javascript
"constraints": {
                "cost": {"max": budgetMax}, 
                "beef": {"max": +(budgetMax * 0.3).toFixed(2)},
                "fillet": {"max": +(budgetMax * 0.25).toFixed(2)},
                "sausage": {"max": +(budgetMax * 0.2).toFixed(2)},
                "chicken": {"max": +(budgetMax * 0.6).toFixed(2)},
            }
```

Last but not least we set the menus their price as well as their relevant ingredients with respect to the constraints as variables of the optimization e. g. 

```javascript
 "variables": {
                "menu1": {"guest": 1, "menu1": 1, "cost": menu1Cost, "beef": menu1Beef, "fillet": menu1Fillet, "sausage": menu1Sausage, "chicken": menu1Chicken},
                "menu2": {"guest": 1, "menu2": 1, "cost": menu2Cost, "beef": menu2Beef, "fillet": menu2Fillet, "sausage": menu2Sausage, "chicken": menu2Chicken},
                "menu3": {"guest": 1, "menu3": 1, "cost": menu3Cost, "beef": menu3Beef, "fillet": menu3Fillet, "sausage": menu3Sausage, "chicken": menu3Chicken},
                "menu4": {"guest": 1, "menu4": 1, "cost": menu4Cost, "beef": menu4Beef, "fillet": menu4Fillet, "sausage": menu4Sausage, "chicken": menu4Chicken}

            }
```

The hard work of the calculation is then done by the aforementioned npm package.
## How to execute

You can run the functions locally via `func start`. Several HTTP calls are available in the file `requests.http` (required: [REST CLient extension in VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client))
