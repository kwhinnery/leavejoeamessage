var MessageListController = function($scope, $http) {
    $scope.filter = $scope.admin ? 'unapproved' : 'recent';
    $scope.fetching = true;
    $scope.messages = [];

    $scope.fetchMessages = function() {
        // Will flip on ajax spinner
        $scope.fetching = true;

        // Determine URL we hit - if admin, use the admin search
        var url = $scope.admin ? '/admin/messages' : '/messages';

        // Create request args
        var params = {};
        if ($scope.filter === 'favorites') {
            params.favorites = true;
        }

        if ($scope.filter === 'unapproved') {
            params.unapproved = true;
        }

        // Request a message list
        var p = $http.get(url, {
            params: params
        }).success(function(data, status) {
            $scope.messages = data;
        }).error(function(data, status) {
            alert('There was an error fetching the latest messages, please try again later.');
            console.error(data);
        }).finally(function() {
            $scope.fetching = false;
        });
    };

    // Set the current filter and grab results
    $scope.selectFilter = function(filterValue) {
        $scope.filter = filterValue;
        $scope.fetchMessages();
    };

    // Fetch the initial set of messages
    $scope.fetchMessages();
};

// Make sure dependency injection doesn't break in minification
MessageListController.$inject = ['$scope', '$http'];

// Export public module interface
module.exports = MessageListController;