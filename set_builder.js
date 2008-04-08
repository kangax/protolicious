/*


var numbers = [1,2,3,4,5,6,7,8,9];


var lessThanFive = numbers.findAll(function(n) { return n<5 });
// vs
var lessThanFive = SetBuilder('x | x <- numbers, x<5');


var moreThanFiveSquare = numbers.findAll(function(n) { return n>5 }).map(function(n) { return n*n });
// or
var moreThanFiveSquare = numbers.inject([], function(result, n) { if (n>5) result.push(n); return result });
// vs
var moreThanFiveSquare = SetBuilder('x*x | x <- numbers, x>5');


*/

SetBuilder = function(expr, scope) {
  var scope = scope || this,
      re = /([^|]*)\|([^<]*)<-([^,]*),([^$]*)$/,
      match = expr.match(re),
      id, action, source, condition, results = [];

  if (!match) throw new Error('Error parsing expression');

  match = match.invoke('strip');

  id = match[2];
  source = match[3];
  action = match[1].replace(id, '_', 'g');
  condition = match[4].replace(id, '_', 'g');

  scope[source].each(function(_) {
    if (eval(condition)) results.push(eval(action))
  })

  return results;
}