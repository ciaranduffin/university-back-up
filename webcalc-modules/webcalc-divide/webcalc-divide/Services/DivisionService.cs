using System;
using webcalc_divide.Models;

namespace webcalc_divide.Services
{
    public class DivisionService
    {
        public DivisionService()
        {

        }

        public int Divide(int x, int y)
        {
            return (x / y - Convert.ToInt32(((x < 0) ^ (y < 0)) && (x % y != 0)));
        }

        public OperationOutput ValidateInputs(string x, string y)
        {
            var jsonResponse = new OperationOutput
            {
                Error = false,
                String = "",
                Answer = 0,
            };

            //Check inputs not null
            if (String.IsNullOrEmpty(x) || String.IsNullOrEmpty(y))
            {
                jsonResponse = new OperationOutput
                {
                    Error = true,
                    String = "One or both required parameters (x and y) are missing.",
                    Answer = 0,
                };

            }

            //Check inputs are numeric
            else if (!(double.TryParse(x, out double a)) || !(double.TryParse(y, out double b)))
            {
                jsonResponse = new OperationOutput
                {
                    Error = true,
                    String = "One or both required parameters (x and y) are non numeric.",
                    Answer = 0,
                };
            }

            //Check inputs are whole numbers
            else if (!(int.TryParse(x, out int c)) || !(int.TryParse(y, out int d)))
            {
                jsonResponse = new OperationOutput
                {
                    Error = true,
                    String = "One or both required parameters (x and y) are not whole numbers.",
                    Answer = 0,
                };
            }

            return jsonResponse;

        }
    }
}
