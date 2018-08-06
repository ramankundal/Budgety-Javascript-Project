//Budget Controller

var budgetController = (function () {

    var Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage=-1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0){
            this.percentage= Math.round((this.value/totalIncome)*100);
        } else{
            this.percentage=-1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }; 
    var Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var data = {

        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
            budget:0,
            percentage:0,
        }
    }
    
    var calculateTotal= function(type){
        console.log("Inside Calculate budge in Budget controller");
            var total=0;
            data.allItems[type].forEach(function(element) {
                total+=element.value;
              });
              data.totals[type]=total;
              console.log(type+" "+data.totals[type]);
    }

    return {
        addItem: function (type, desc, value) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, desc, value);

                console.log("adding new expense");
                //   data.totals.exp+= newItem.value;
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, value);

                console.log("adding new income");
                // data.totals.inc+= this.newItem.value;
                // console.log("income total"+data.totals.inc);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type,id){

            // id =6
            //data.allItems[type][id]
            //ids  =[1 3 5 6 7]
            //index=3
            var IDs;
            IDs =data.allItems[type].map(function(current){
                return current.id;
            });

            index= IDs.indexOf(id);
            console.log("IDs Array: "+  index);
            if(index!== -1){
            data.allItems[type].splice(index,1);
            }
            
        },
        testingData: function () {
            console.log(data);
        },
        calculateBudget: function(type){
            calculateTotal('exp'); 
            calculateTotal('inc'); 
            data.totals.budget= data.totals.inc - data.totals.exp;
            if(data.totals.inc>0){
            data.totals.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            } else {
                data.totals.percentage=-1;
            }
            console.log("budget "+ data.totals.budget);
            console.log("percentage "+ data.totals.percentage);
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPerc;
            allPerc= data.allItems.exp.map(function(cur){
               return  cur.getPercentage();
            });
            return allPerc;
        },
        getBudget: function(){
            
            return {
                budget: data.totals.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percent:data.totals.percentage
            }
        }
    }
})();

//UI Controller
var UIController = (function () {
    //code
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputAdd: '.add__btn',
        incomeSelect: '.income__list',
        expenseSelect: '.expenses__list',
        budget:'.budget__value',
        income:'.budget__income--value',
        expense:'.budget__expenses--value',
        percent:'.budget__expenses--percentage',
        parentElement:'.container',
        percentageLabel:'.item__percentage'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                desc: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        getDOMstring: function () {
            return DOMstrings;
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeSelect;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseSelect;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function(id){

            var removeNode= document.getElementById(id);
             removeNode.parentNode.removeChild(removeNode);

        },
        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDesc + ',' + DOMstrings.inputValue);
            for (i = 0; i < fields.length; i++) {
                fields[i].value = "";
            }
            fields[0].focus();
            console.log(fields);
        },
        displayPercentages: function(percentages){
            var fields;
            console.log("hrrrrrrr"+percentages);
            fields= document.querySelectorAll(DOMstrings.percentageLabel);
            
            var nodeListForEach= function(list, callback){
                 for (var i=0;i<list.length;i++){
                     callback(list[i],i);
                 }
            }

            nodeListForEach(fields, function(current, index){
                if (percentages[index] >0){
                current.textContent=percentages[index]+"%";
                }
                else{
                current.textContent="---";
                }
            });

        },
        updateBudgetUI:function(obj){
            document.querySelector(DOMstrings.budget).textContent=obj.budget;
            document.querySelector(DOMstrings.income).textContent=obj.totalInc;
            document.querySelector(DOMstrings.expense).textContent=obj.totalExp;

            if(obj.percent>0){
                document.querySelector(DOMstrings.percent).textContent=obj.percent+"%";
            } else {
                document.querySelector(DOMstrings.percent).textContent="---"
            }

        }
    };

})();

// GLOBAL app controller
var Controller = (function (budgetCtrl, UICtrl) {

    //code 

    var setUpEventListeners = function () {
        var DOMbtn = UICtrl.getDOMstring();
        document.querySelector(DOMbtn.inputAdd).addEventListener('click', addItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });

        document.querySelector(DOMbtn.parentElement).addEventListener('click',ctrlDeleteItem);

    };

    var updateBudget = function () {

        // calculate budget 
        budgetCtrl.calculateBudget();
        var budget=budgetCtrl.getBudget();
        //return budget 
        //display budget to UI
        UICtrl.updateBudgetUI(budget);
        updatePercentages();

    }; 

    var updatePercentages = function(){

        // calculate pecentages
        console.log("entering update percentage method");
        budgetCtrl.calculatePercentages();

        //get percentages

        var allPercentages= budgetCtrl.getPercentages();

        console.log("loggin all percentags  "+ allPercentages);
        UICtrl.displayPercentages(allPercentages);

    };
    var addItem = function () {
        var item;
        var input = UICtrl.getInput(); //get input
        if (input.desc != "" && !isNaN(input.value) && input.value > 0) {
            item = budgetCtrl.addItem(input.type, input.desc, input.value); //add item to budget controller
            budgetCtrl.testingData();


            // add item to UI
            UICtrl.addListItem(item, input.type);

            //clear fields
            UICtrl.clearFields();
            updateBudget();
        }
    };

    var ctrlDeleteItem= function(event ){

        var nodeId, id, type, splitId;
        nodeId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitId= nodeId.split('-');
        type= splitId[0];
        id=parseInt(splitId[1]);
       console.log("loggin from main controller"+type+id)
        // delete the item from data structure
        budgetCtrl.deleteItem(type,id);
        


        // delete from UI
        UICtrl.deleteListItem(nodeId);
        // update budget
        updateBudget();

        //update percentags

    }

    return {
        init: function () {
            console.log("application has started");
            setUpEventListeners();
        }
    }


})(budgetController, UIController);

Controller.init();