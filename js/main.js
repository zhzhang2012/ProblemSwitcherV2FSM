var app = angular.module("problemSwitcher", [])

app.factory("data", function () {
    return {
        problems: [
            {
                "id": 1,
                "body": "1选哪个呢？",
                "choices": [
                    {id: 0, "body": "1ya1", "is_correct": true},
                    {id: 1, "body": "1ya2", "is_correct": false},
                    {id: 2, "body": "1ya3", "is_correct": false},
                    {id: 3, "body": "1ya4", "is_correct": false}
                ]
            },
            {
                "id": 2,
                "body": "2选哪个呢？",
                "choices": [
                    {id: 0, "body": "2ya1", "is_correct": false},
                    {id: 1, "body": "2ya2", "is_correct": false},
                    {id: 2, "body": "2ya3", "is_correct": true},
                    {id: 3, "body": "2ya4", "is_correct": false}
                ]
            },
            {
                "id": 3,
                "body": "3选哪个呢？",
                "choices": [
                    {id: 0, "body": "3ya1", "is_correct": true},
                    {id: 1, "body": "3ya2", "is_correct": false},
                    {id: 2, "body": "3ya3", "is_correct": false},
                    {id: 3, "body": "3ya4", "is_correct": false}
                ]
            },
            {
                "id": 4,
                "body": "4选哪个呢？",
                "choices": [
                    {id: 0, "body": "4ya1", "is_correct": false},
                    {id: 1, "body": "4ya2", "is_correct": false},
                    {id: 2, "body": "4ya3", "is_correct": false},
                    {id: 3, "body": "4ya4", "is_correct": true}
                ]
            }
        ]
    }
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/welcome', {
            templateUrl: 'partials/problemWelcome.html'
        })
        .when('/problem', {
            controller: 'problemCtrl',
            templateUrl: 'partials/problemShow.html'
        })
        .when('/summary', {
            controller: 'summaryCtrl',
            templateUrl: 'partials/problemResult.html'
        })
});

var FSM = function () {
    var fsm = StateMachine.create({

        events: [
            { name: 'start', from: 'none', to: 'welcome'},
            { name: 'next', from: 'welcome', to: 'problem'},
            { name: 'complete', from: 'problem', to: 'summary'},
            { name: 'restart', from: 'summary', to: 'welcome'}
        ],

        callbacks: {
            onstart: function (event, from, to) {
                location.href = 'problems.html#/welcome';
                //$location.path('/welcome');
            },
            onwelcome: function (event, from, to) {
                location.href = 'problems.html#/problem';
                //$location.path('/problem');
            },
            oncomplete: function (event, from, to) {
                location.href = 'problems.html#/summary';
                //$location.path('/summary');
            },
            onrestart: function (event, from, to) {
                location.href = 'problems.html#/welcome';
                //$location.path('/welcome');
            }
        }
    });

    fsm.start();
    return fsm;

}();

var USERDATA = {};

var problemCtrl = function ($scope, data) {
    $scope.problems = data.problems;
    $scope.last = false;

    $scope.showSummary = function () {
        $scope.last = true;
    };
}

var summaryCtrl = function ($scope, data) {
    $scope.problems = data.problems;

    $scope.result = function () {
        var correctNum = 0;

        for (var i = 1; i <= $scope.problems.length; i++) {
            if (USERDATA[i] !== undefined && USERDATA[i] !== null && USERDATA[i].is_correct) {
                correctNum++;
            }
        }

        return correctNum;
    }
}

app.directive("switch", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            scope.$on("complete", function () {
                PageTransitions.init($(element), function () {
                    scope.$apply(attrs.switch);
                });
            })
        }
    };
});

app.directive("problem", function (data) {
    return {
        restrict: "A",
        templateUrl: "partials/_show.html",
        link: function (scope, element) {
            scope.$watch('answer', function (value) {

                if (scope.$last) {
                    scope.$emit("complete");
                }

                if (scope.problem.choices[value] !== undefined && scope.problem.choices[value] !== null) {
                    if (scope.problem.choices[value].is_correct) {

                        USERDATA[scope.problem.id] = {"is_correct": true};
                    } else {
                        USERDATA[scope.problem.id] = {"is_correct": false};
                    }
                }
            });
        }
    };
});

app.directive("result", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "partials/_result.html"
    }
});


