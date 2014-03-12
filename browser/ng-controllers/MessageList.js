var MessageListController = function($scope, $http) {
    $scope.filter = 'recent';
    $scope.fetching = true;
    $scope.messages = [];

    function fetchMessages(favorites) {
        // Will flip on ajax spinner
        $scope.fetching = true;

        // Create request args
        var params = {};
        if ($scope.filter === 'favorites') {
            params.favorites = true;
        }

        // Request a message list
        var p = $http.get('/messages', {
            params: params
        }).success(function(data, status) {
            $scope.messages = data;
        }).error(function(data, status) {
            alert('There was an error fetching the latest messages, please try again later.');
            console.error(data);
        }).finally(function() {
            $scope.fetching = false;
        });
    }

    // Set the current filter and grab results
    $scope.selectFilter = function(filterValue) {
        $scope.filter = filterValue;
        fetchMessages();
    };

    // Fetch the initial set of messages
    fetchMessages();
};

// Make sure dependency injection doesn't break in minification
MessageListController.$inject = ['$scope', '$http'];

// Export public module interface
module.exports = MessageListController;