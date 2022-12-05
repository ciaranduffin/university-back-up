using System;
using Microsoft.AspNetCore.Mvc;
using webcalc_divide.Models;
using webcalc_divide.Services;

namespace webcalc_divide.Controllers
{
    [ApiController]
    [Route("")]
    public class DivisionController : ControllerBase
    {
        DivisionService _divisionService;

        public DivisionController(DivisionService divisionService)
        {
            _divisionService = divisionService;
        }

        [HttpGet]
        public IActionResult Get([FromQuery(Name = "x")] string x, [FromQuery(Name = "y")] string y)
        {
            var statusCode = 200;


            var output = _divisionService.ValidateInputs(x, y);

            if (output.Error)
            {
                statusCode = 400;
            }
            else
            {
                var answer = _divisionService.Divide(Int32.Parse(x), Int32.Parse(y));
                output = new OperationOutput
                {
                    Error = false,
                    String = $"{x}/{y}={answer}",
                    Answer = answer,
                };
            }

            if (statusCode == 200)
            {
                return Ok(output);
            }
            else
            {
                return BadRequest(output);
            }

        }

        [HttpGet]
        [Route("discovery")]
        public IActionResult GetDiscovery()
        {
            var output = new DiscoveryOutput
            {
                Operator = "div"
            };

            return Ok(output);
        }
    }
}
