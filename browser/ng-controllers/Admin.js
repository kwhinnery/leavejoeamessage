var AdminController = function($scope) {
    $scope.admin = true;
};

// Make sure the preserve the meaning of the scope variable through minification
AdminController.$inject = ['$scope'];

// Export the public module interface, the controller constructor
module.exports = AdminController;