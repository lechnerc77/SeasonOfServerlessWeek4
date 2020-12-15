const solver = require("javascript-lp-solver")

module.exports = async function (context, req) {

    
    if (req.query && req.query.budget && +req.query.budget > 0){

        // Define the prices per kilo or per piece for the ingredients
        const beefPrice = 12 //€ per kg
        const filletPrice = 32 //€ per kg
        const sausagesPrice = 1.5 //€ per piece | 12 € per kg 
        const chickenPrice = 15 //€ per kg
        const grilledCheesePrice = 2 //€ per piece
        const garlicBreadPrice = 1 //€ per piece

        // We split between male and female participants as suggested in the excel and divide the assignment
        const budgetMax =  +(+req.query.budget / 2).toFixed(2)

        // Define the possible meals (male): ~400g meat per person
        // Menu 1 - a bit beef, a few sausages
         const menu1Beef = +(beefPrice * 0.25).toFixed(2)
         const menu1Fillet = +(filletPrice * 0).toFixed(2)
         const menu1Sausage = +(sausagesPrice * 3).toFixed(2)
         const menu1Chicken =  +(chickenPrice * 0).toFixed(2)
         const menu1GrilledCheese = grilledCheesePrice * 1
         const menu1GarlicBread = garlicBreadPrice * 2
         const menu1Cost = menu1Beef + menu1Fillet + menu1Sausage + menu1Chicken + menu1GrilledCheese + menu1GarlicBread
        
        // Menu 2 - a bit beef, a bit fillet
        const menu2Beef = +(beefPrice * 0.3).toFixed(2)
        const menu2Fillet = +(filletPrice * 0.1).toFixed(2)
        const menu2Sausage = +(sausagesPrice * 0).toFixed(2)
        const menu2Chicken =  +(chickenPrice * 0).toFixed(2)
        const menu2GrilledCheese = grilledCheesePrice * 1
        const menu2GarlicBread = garlicBreadPrice * 2
        const menu2Cost = menu2Beef + menu2Fillet + menu2Sausage + menu2Chicken + menu2GrilledCheese + menu2GarlicBread

        // Menu 3 - SAUSAGES, SAUSAGES
        const menu3Beef = +(beefPrice * 0).toFixed(2)
        const menu3Fillet = +(filletPrice * 0).toFixed(2)
        const menu3Sausage = +(sausagesPrice * 6).toFixed(2)
        const menu3Chicken =  +(chickenPrice * 0).toFixed(2)
        const menu3GrilledCheese = grilledCheesePrice * 2
        const menu3GarlicBread = garlicBreadPrice * 2
        const menu3Cost = menu3Beef + menu3Fillet + menu3Sausage + menu3Chicken + menu3GrilledCheese + menu3GarlicBread

        // Menu 4 - Chicken & Cheese
        const menu4Beef = +(beefPrice * 0.2).toFixed(2)
        const menu4Fillet = +(filletPrice * 0).toFixed(2)
        const menu4Sausage = +(sausagesPrice * 0).toFixed(2)
        const menu4Chicken =  +(chickenPrice * 0.2).toFixed(2)
        const menu4GrilledCheese = grilledCheesePrice * 3
        const menu4GarlicBread = garlicBreadPrice * 2
        const menu4Cost = menu4Beef + menu4Fillet + menu4Sausage + menu4Chicken + menu4GrilledCheese + menu4GarlicBread


        // Define the possible meals (female): ~300g meat per person
        // Menu 5 - a bit beef, a few sausages
        const menu5Beef = +(beefPrice * 0.15).toFixed(2)
        const menu5Fillet = +(filletPrice * 0).toFixed(2)
        const menu5Sausage = +(sausagesPrice * 2).toFixed(2)
        const menu5Chicken =  +(chickenPrice * 0).toFixed(2)
        const menu5GrilledCheese = grilledCheesePrice * 0
        const menu5GarlicBread = garlicBreadPrice * 2
        const menu5Cost = menu5Beef + menu5Fillet + menu5Sausage + menu5Chicken + menu5GrilledCheese + menu5GarlicBread
       
       // Menu 2 - a bit beef, a bit fillet
       const menu6Beef = +(beefPrice * 0.2).toFixed(2)
       const menu6Fillet = +(filletPrice * 0.1).toFixed(2)
       const menu6Sausage = +(sausagesPrice * 0).toFixed(2)
       const menu6Chicken =  +(chickenPrice * 0).toFixed(2)
       const menu6GrilledCheese = grilledCheesePrice * 1
       const menu6GarlicBread = garlicBreadPrice * 2
       const menu6Cost = menu6Beef + menu6Fillet + menu6Sausage + menu6Chicken + menu6GrilledCheese + menu6GarlicBread

       // Menu 3 - SAUSAGES, SAUSAGES
       const menu7Beef = +(beefPrice * 0).toFixed(2)
       const menu7Fillet = +(filletPrice * 0).toFixed(2)
       const menu7Sausage = +(sausagesPrice * 4).toFixed(2)
       const menu7Chicken =  +(chickenPrice * 0).toFixed(2)
       const menu7GrilledCheese = grilledCheesePrice * 2
       const menu7GarlicBread = garlicBreadPrice * 1
       const menu7Cost = menu7Beef + menu7Fillet + menu7Sausage + menu7Chicken + menu7GrilledCheese + menu7GarlicBread

       // Menu 4 - Chicken & Cheese
       const menu8Beef = +(beefPrice * 0.15).toFixed(2)
       const menu8Fillet = +(filletPrice * 0).toFixed(2)
       const menu8Sausage = +(sausagesPrice * 0).toFixed(2)
       const menu8Chicken =  +(chickenPrice * 0.15).toFixed(2)
       const menu8GrilledCheese = grilledCheesePrice * 1
       const menu8GarlicBread = garlicBreadPrice * 1
       const menu8Cost = menu8Beef + menu8Fillet + menu4Sausage + menu8Chicken + menu8GrilledCheese + menu8GarlicBread


        // Setup the model for male guests
        modelMale= {
            "optimize": "guest",
            "opType": "max",
            "constraints": {
                "cost": {"max": budgetMax}, 
                "beef": {"max": +(budgetMax * 0.4).toFixed(2)},
                "fillet": {"max": +(budgetMax * 0.25).toFixed(2)},
                "sausage": {"max": +(budgetMax * 0.5).toFixed(2)},
                "chicken": {"max": +(budgetMax * 0.4).toFixed(2)},
            },
            "variables": {
                "menu1": {"guest": 1, "menu1": 1, "cost": menu1Cost, "beef": menu1Beef, "fillet": menu1Fillet, "sausage": menu1Sausage, "chicken": menu1Chicken},
                "menu2": {"guest": 1, "menu2": 1, "cost": menu2Cost, "beef": menu2Beef, "fillet": menu2Fillet, "sausage": menu2Sausage, "chicken": menu2Chicken},
                "menu3": {"guest": 1, "menu3": 1, "cost": menu3Cost, "beef": menu3Beef, "fillet": menu3Fillet, "sausage": menu3Sausage, "chicken": menu3Chicken},
                "menu4": {"guest": 1, "menu4": 1, "cost": menu4Cost, "beef": menu4Beef, "fillet": menu4Fillet, "sausage": menu4Sausage, "chicken": menu4Chicken}

            },
            "ints": {"menu1": 1, "menu2": 1, "menu3": 1, "menu4": 1}
        }


        // Execute the linear optimization based on the constraints for male guests
        const resultMale = solver.Solve(modelMale)

        // Setup the model for female guests
         modelFemale= {
            "optimize": "guest",
            "opType": "max",
            "constraints": {
                "cost": {"max": budgetMax}, 
                "beef": {"max": +(budgetMax * 0.3).toFixed(2)},
                "fillet": {"max": +(budgetMax * 0.25).toFixed(2)},
                "sausage": {"max": +(budgetMax * 0.2).toFixed(2)},
                "chicken": {"max": +(budgetMax * 0.6).toFixed(2)},
            },
            "variables": {
                "menu5": {"guest": 1, "menu5": 1, "cost": menu5Cost, "beef": menu5Beef, "fillet": menu5Fillet, "sausage": menu5Sausage, "chicken": menu5Chicken},
                "menu6": {"guest": 1, "menu6": 1, "cost": menu6Cost, "beef": menu6Beef, "fillet": menu6Fillet, "sausage": menu6Sausage, "chicken": menu6Chicken},
                "menu7": {"guest": 1, "menu7": 1, "cost": menu7Cost, "beef": menu7Beef, "fillet": menu7Fillet, "sausage": menu7Sausage, "chicken": menu7Chicken},
                "menu8": {"guest": 1, "menu8": 1, "cost": menu8Cost, "beef": menu8Beef, "fillet": menu8Fillet, "sausage": menu8Sausage, "chicken": menu8Chicken}

            },
            "ints": {"menu5": 1, "menu6": 1, "menu7": 1, "menu8": 1}
        }
        // Execute the linear optimization based on the constraints for female guests
        const resultFemale = solver.Solve(modelFemale)

        // Build the result message
        context.res = {
            status: 200,
            body: {

                "🍽 - Overall Number of guests": +resultMale.result + +resultFemale.result,
                "Number of male guests": resultMale.result,
                "Number of female guests": resultFemale.result,
                "Distribution of meals": [
                    { "Male - Meal 1 (a bit beef, a few sausages)": resultMale.menu1 ? resultMale.menu1 : 0},
                    { "Male - Meal 2 (a bit beef, a bit fillet)": resultMale.menu2 ? resultMale.menu2 : 0 },
                    { "Male - Meal 3 (SAUSAGES, SAUSAGES)": resultMale.menu3 ? resultMale.menu3 : 0},
                    { "Male - Meal 4 (Chicken & Cheese)": resultMale.menu4 ? resultMale.menu4 : 0},
                    { "Female - Meal 1 (a bit beef, a few sausages)": resultFemale.menu5 ? resultFemale.menu5 : 0 },
                    { "Female - Meal 2 (a bit beef, a bit fillet)": resultFemale.menu6 ? resultFemale.menu6 : 0  },
                    { "Female - Meal 3 (SAUSAGES, SAUSAGES)": resultFemale.menu7 ? resultFemale.menu7 : 0  },
                    { "Female - Meal 4 (Chicken & Cheese)": resultFemale.menu8 ? resultFemale.menu8 : 0  }
                ]

            }
        }
    }
    else{
        context.res = {
            status: 400,
            body: "Please provide budget in € as query parameter"
        }  
    }
}