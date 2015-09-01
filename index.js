/**
 * Created by stevenchin on 8/20/15.
 */

'use strict';

var inquirer = require('inquirer'),
    formularySvc = require('./lib/svc/formulary-svc'),
    _ = require('lodash'),
    bases = require('bases'),
    stringifyJson = require('./lib/svc/util').stringifyJson,
    stepOne = require('./lib/config/step-one'),
    stepTwo = require('./lib/config/step-two'),
    stepThree = require('./lib/config/step-three');

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
    var productString = 'Product' + option + ': ' + stringifyJson(product, '\t');
    var productChoice = {
      key: bases.toBase26(index),
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
  console.error(stringifyJson(err, '\t'));
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
  console.log('Product: %s', stringifyJson(stepTwo.answers.productListChoice, '\t'));
  console.log('PlanId: %s', stepOne.answers.planId);
  console.log('Formulary Tier: %s', stringifyJson(formularyTier, '\t'));
  //prompt user to conduct a new search
  setTimeout(newSearch, 2000);
};

var search = function(){
  inquirer.prompt(stepOne.questions, stepOneHandler);
};

var newSearch = function(){
  inquirer.prompt( stepThree.questions, stepThreeHandler);
};

var stepThreeHandler = function( answers ) {
  if ( answers.newSearch ) {
    resetSelection();
    usePrevInput();
    inquirer.prompt(stepOne.questions, stepOneHandler);
  }
  else {
    console.log('Thank you for using the mmit-formulary-cli!!!');
  }
};

var resetSelection = function(){
  stepTwo.questions[0].choices = [];
};

var usePrevInput = function(){
  var stepOneQuestions = stepOne.questions,
      stepOneRes = stepOne.answers;
  stepOneQuestions[0].default = stepOneRes.username;
  stepOneQuestions[1].default = stepOneRes.password;
  stepOneQuestions[3].default = stepOneRes.planId;
};

search();