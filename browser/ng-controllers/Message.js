var buzz = require('node-buzz');

var MessageController = function($scope, $http, $element) {
    $scope.messageVisible = true;

    // This functionality is only necessary for messages that have recordings
    if ($scope.message.type === 'call') {
        $scope.linkText = 'Play Message';

        var sound = new buzz.sound([
            $scope.message.recordingUrl+'.wav',
            $scope.message.recordingUrl+'.mp3'
        ]);

        // Play a given recording
        $scope.toggle = function() {
            if (!sound.isPaused()) {
                $scope.linkText = 'Play Message';
                sound.stop();
            } else {
                $scope.linkText = 'Loading Message...';
                sound.play();

                // Update the link when the message starts playing
                sound.bind('playing', function(e) {
                    $scope.$apply(function() {
                        $scope.linkText = 'Pause Message';
                    });
                });

                // Reset automatically when the message ends
                sound.bind('ended', function(e) {
                    $scope.$apply(function() {
                        $scope.linkText = 'Play Message';
                    });
                });
            }
        };
    }

    // Admin controls - requires HTTP basic auth
    function remove() {
        console.log($scope.messages);
    }

    function update(properties) {
        var url = '/admin/messages/'+$scope.message._id;

        $http.post(url, {
            props: JSON.stringify(properties)
        }).success(function(data, status) {
            console.log($scope.filter);
            if ($scope.filter !== 'unapproved') {
                remove();
            }
        }).error(function(data, status) {
            alert('Error updating doc: '+data);
        });
    }

    // Approve a message
    $scope.approve = function() {
        update({
            approved: true
        });
    };

    // Mark a message as favorite
    $scope.markFavorite = function() {
        update({
            approved: true,
            favorite: true
        });
    };

    // Remove a message
    $scope.removeMessage = function() {
        var url = '/admin/messages/'+$scope.message._id;

        $http.delete(url).success(function(data, status) {
            remove();
        }).error(function(data, status) {
            alert('Error deleting doc: '+data);
        });
    };
};

// Make sure the preserve the meaning of the scope variable through minification
MessageController.$inject = ['$scope', '$http'];

// Export the public module interface, the controller constructor
module.exports = MessageController;