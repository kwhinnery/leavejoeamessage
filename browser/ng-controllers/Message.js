var buzz = require('node-buzz');

var MessageController = function($scope) {
    // This functionality is only necessary for messages that have recordings
    if ($scope.message.type !== 'call') return;

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
            sound.bindOnce('playing', function() {
                $scope.$apply(function() {
                    $scope.linkText = 'Pause Message';
                });
            });

            // Reset automatically when the message ends
            sound.bindOnce('ended', function() {
                $scope.$apply(function() {
                    $scope.linkText = 'Play Message';
                });
            });
        }
    };
};

// Make sure the preserve the meaning of the scope variable through minification
MessageController.$inject = ['$scope'];

// Export the public module interface, the controller constructor
module.exports = MessageController;