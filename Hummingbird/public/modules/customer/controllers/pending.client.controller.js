'use strict';

var app1 = angular.module('customer');

app1.run( function($rootScope) {
  $rootScope.accessors = {
    getId: function(row) {
      return row._id;
    }
  };
});

app1.controller('PendingController', function($scope, OrderService) {
  $scope.order = OrderService.getData();
});


app1.factory('OrderService', function() {
  return {
    getData: function() {
      return [
              {
              _id: '123456',
              name: 'Gonorrhea Test',
              location: '18.29057, 1.18872',
              active: 'At Lab'
              },
         
              {
              _id: '0011200',
              name: 'Herpes Test',
              location: '-44.88044, 143.91922',
              active: 'In Transit'
              }
        ];
    }
  };
});
