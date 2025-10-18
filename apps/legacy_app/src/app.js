import angular from 'angular';
import '../../../libs/ui-styles/src/shared-styles.css';

const jokes = [
  "Why did the JavaScript developer wear glasses? Because he couldn't C#.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "Why was the function sad after a successful first call? Because it didn't get a callback."
];

angular.module('legacyApp', [])
  .controller('MainCtrl', function($scope) {
    $scope.joke = jokes[0];
    $scope.nextJoke = function() {
      const idx = Math.floor(Math.random() * jokes.length);
      $scope.joke = jokes[idx];
    };
  });