module.exports = {
    validate: function (x, y) {
        // print(typeof(x))

        var output = {
            'error': false,
            'string': '',
            'answer': 0
        };

        if (x == null || y == null) {
            var output = {
                'error': true,
                'string': 'One or both required parameters (x and y) are missing.',
                'answer': 0
            };
        }
        else if (isNaN(x) || isNaN(y)) {
            var output = {
                'error': true,
                'string': 'One or both required parameters (x and y) are non numeric.',
                'answer': 0
            };
        }
        else if (!Number.isInteger(parseFloat(x))  || !Number.isInteger(parseFloat(y))){
            var output = {
                'error': true,
                'string': 'One or both required parameters (x and y) are not whole numbers.',
                'answer': 0
            };
        }


        return output;
    }
}
