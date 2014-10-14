describe('Whole app', function() {
  var scope;
  
  beforeEach(module('nwslData'));

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('GraphsCtrl', {
      $scope: scope
    });
  }));

  it('should get team data from service', function () {
    expect(scope.test.length).to.equal(2);
  });
});