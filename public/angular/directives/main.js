// question directive
app.directive('questionDirective', function() {
    return function(scope, element, attrs) {
        if (scope.$last) {


            $('#allquestions').fadeIn('slow');

        }

    }
})