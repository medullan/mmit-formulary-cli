/**
 * Created by stevenchin on 8/20/15.
 */

'use strict';

var inquirer = require('inquirer'),
    formularySvc = require('./lib/svc/formulary-svc'),
    _ = require('lodash');

var stepOne = {
    questions: [
      {
        type: 'input',
        name: 'username',
        message: 'Enter your MMIT username:'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your MMIT password:'
      },
      {
        type: 'input',
        name: 'productName',
        message: 'Enter name of the product/drug you want to find:'
      },
      {
        type: 'input',
        name: 'planId',
        message: 'Enter your planId:'
      }
    ],
    answers: {}
};

var stepTwo = {
  questions: [
    {
      type: 'list',
      name: 'productListChoice',
      message: 'Choose the product you want you want to find the formulary for: ',
      choices: []
    }
  ],
  answers: {}
};

var stepOneHandler = function(res) {
  var stepOneRes = stepOne.answers = res;
  formularySvc.requestToken(stepOneRes.username.trim(), stepOneRes.password.trim())
      .then(getProductList)
      .then(displayProductList, logErrors)
      .done();
};

var getProductList = function(){
  return formularySvc.getProductByName(stepOne.answers.productName.trim());
};

var displayProductList = function(productList){
  var stepTwoChoices = stepTwo.questions[0].choices;
  if(_.isEmpty(productList)){
    console.error('An empty product list was returned for %s, please ensure the product has been spelt correctly', stepOne.answers.productName);
    return;
  }
  productList.forEach(function(product, index){
    var option = index + 1;
    var productString = 'Product' + option + ': ' + JSON.stringify(product);
    var productChoice = {
      name: productString,
      value: product
    };
    stepTwoChoices.push(productChoice);
    stepTwoChoices.push(new inquirer.Separator());
  });
  inquirer.prompt(stepTwo.questions, stepTwoHandler);
};

var logErrors = function(err){
  console.error('Something went wrong while requesting data from MMIT, see the details below: ');
  console.error(JSON.stringify(err, null, ' '));
};

var stepTwoHandler = function(res){
  var stepOneRes = stepOne.answers,
      stepTwoRes = stepTwo.answers = res;
  formularySvc.getCoverage(stepTwoRes.productListChoice.ProductId, stepOneRes.planId.trim())
      .then(getFormularyFromCoverage)
      .then(displayResults, logErrors)
      .done();
};

var getFormularyFromCoverage = function(coverageList){
  if(_.isEmpty(coverageList)){
    console.error('Could not find the selected product, productId: %s, in the plan formulary, planId: %s', stepTwo.answers.ProductId, stepOne.answers.planId);
    return;
  }
  var tierId = coverageList[0].FormularyTierId;
  return formularySvc.getFormularyTier(tierId);
};

var displayResults = function(formularyTier){
  console.log('\n----- Results summary -----\n');
  console.log('Product: %s', JSON.stringify(stepTwo.answers.productListChoice));
  console.log('PlanId: %s', stepOne.answers.planId);
  console.log('Formulary Tier: %s', JSON.stringify(formularyTier));
};

//Get input from user
inquirer.prompt(stepOne.questions, stepOneHandler);