using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using webcalc_divide.Services;
using Xunit;
using System.Net;

namespace webcalc_divide.IntegrationTests
{
    public class DivisionTests 
    {
        private readonly HttpClient _testClient;
        DivisionService _divisionService;

        public DivisionTests()
        {
            _divisionService = new DivisionService();
            var factory = new WebApplicationFactory<Startup>();
            _testClient = factory.CreateClient();
        }

        [Fact]
        public void PassDivisionTest()
        {
            Assert.Equal(2, _divisionService.Divide(4, 2));
        }

        [Theory]
        [InlineData(4, 2)]
        [InlineData(6, 3)]
        [InlineData(8, 4)]
        [InlineData(10, 5)]
        [InlineData(12, 6)]
        public void  Divide_NumberDividedByItsHalf_ReturnsTwo(int x, int y)
        {
            Assert.Equal(2, _divisionService.Divide(x, y));
        }

        [Theory]
        [InlineData(7, 3)]
        public void Divide_NumberDivideGivensUnEvenResult_ReturnsTwo(int x, int y)
        {
            Assert.Equal(2, _divisionService.Divide(x, y));
        }

        [Fact]
        public void Divide_OnePosOneNeg_ReturnsNegFour()
        {
            Assert.Equal(-4, _divisionService.Divide(-8, 2));
        }

        [Fact]
        public void Divide_OneNegOnePos_ReturnsNegFour()
        {
            Assert.Equal(-4, _divisionService.Divide(8, -2));
        }

        [Fact]
        public void Divide_BothNeg_ReturnsFour()
        {
            Assert.Equal(4, _divisionService.Divide(-8, -2));
        }

        //||--Integration Tests--||

        //<--Response Codes-->
        [Theory]
        [InlineData("/?x=foo&y=bar")]
        [InlineData("/")]
        [InlineData("/?x=4.2&y=3.4")]
        public async Task InValidInputsReturn400(string query)
        {
            var response = await _testClient.GetAsync(query);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        }


        [Theory]
        [InlineData("/?x=4&y=2")]
        [InlineData("/?x=6&y=-2")]
        [InlineData("/?x=-4&y=-8")]
        public async Task ValidInputsReturn200(string query)
        {
            var response = await _testClient.GetAsync(query);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        }

        //<--Response Bodies-->


        [Theory]
        [InlineData("/?x=4&y=2",  "{\"error\":false,\"string\":\"4/2=2\",\"answer\":2}")]
        [InlineData("/?x=4&y=-2", "{\"error\":false,\"string\":\"4/-2=-2\",\"answer\":-2}")]
        [InlineData("/?x=-4&y=-2", "{\"error\":false,\"string\":\"-4/-2=2\",\"answer\":2}")]
        public async Task ValidInput_ReturnsCorrectBody(string url, string expectedBody)
        {
            var response = await _testClient.GetAsync(url);

            response.EnsureSuccessStatusCode();
            Assert.Equal(expectedBody, await response.Content.ReadAsStringAsync());
        }


        [Theory]
        [InlineData("/", "{\"error\":true,\"string\":\"One or both required parameters (x and y) are missing.\",\"answer\":0}")]
        [InlineData("/?x=foo&y=bar", "{\"error\":true,\"string\":\"One or both required parameters (x and y) are non numeric.\",\"answer\":0}")]
        [InlineData("/?x=2.4&y=3.2", "{\"error\":true,\"string\":\"One or both required parameters (x and y) are not whole numbers.\",\"answer\":0}")]
        public async Task InvalidInput_ReturnsCorrectBody(string url, string expectedBody)
        {
            var response = await _testClient.GetAsync(url);

            Assert.Equal(expectedBody, await response.Content.ReadAsStringAsync());
        }


        [Fact]
        public async Task Valid_ReturnsApplicationJson()
        {
            var response = await _testClient.GetAsync("/?x=4&y=2");

            response.EnsureSuccessStatusCode();
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType.ToString());
        }

        [Fact]
        public async Task Invalid_ReturnsApplicationJson()
        {
            var response = await _testClient.GetAsync("/?x=foo&y=bar");

            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType.ToString());
        }
    }
}
