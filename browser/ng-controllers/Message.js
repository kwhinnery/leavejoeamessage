var buzz = require('node-buzz');

module.exports = function($scope) {
    $scope.linkText = 'Play Message';

    // Create a sound from the given recording URL
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