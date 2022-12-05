<?php
//reference https://blog.cloudflare.com/using-guzzle-and-phpunit-for-rest-api-testing/

require_once ('vendor/autoload.php');
require('functions.inc.php');

class IntegrationTest extends PHPUnit_Framework_TestCase
{
    private $http;

    public function setUp()
    {
        $this->http = new GuzzleHttp\Client(['base_uri' => '127.0.0.1:8080']);
    }

    public function tearDown() {
        $this->http = null;
    }

    public function test_ValidInputs_Returns200()
    {
        $response1 = $this->http->request('GET', '/?x=4&y=2', ['http_errors' => false]);
        $response2 = $this->http->request('GET', '/?x=-4&y=-2', ['http_errors' => false]);
        $response3 = $this->http->request('GET', '/?x=4&y=-2', ['http_errors' => false]);


        $this->assertEquals(200, $response1->getStatusCode());
        $this->assertEquals(200, $response2->getStatusCode());
        $this->assertEquals(200, $response3->getStatusCode());
    }

    public function test_InvalidInputs_Returns400()
    {
        $response1 = $this->http->request('GET', '/', ['http_errors' => false]);
        $response2 = $this->http->request('GET', '/?x=foo&y=bar', ['http_errors' => false]);
        $response3 = $this->http->request('GET', '/?x=4.2&y=2.2', ['http_errors' => false]);


        $this->assertEquals(400, $response1->getStatusCode());
        $this->assertEquals(400, $response2->getStatusCode());
        $this->assertEquals(400, $response3->getStatusCode());
    }

    public function test_ValidInputs_ReturnsContentTypeApplicationJson(){
        $response1 = $this->http->request('GET', '/?x=4&y=2', ['http_errors' => false]);
        $response2 = $this->http->request('GET', '/?x=-4&y=-2', ['http_errors' => false]);
        $response3 = $this->http->request('GET', '/?x=4&y=-2', ['http_errors' => false]);

        $this->assertEquals('application/json', $response1->getHeaderLine('Content-Type')); 
        $this->assertEquals('application/json', $response2->getHeaderLine('Content-Type')); 
        $this->assertEquals('application/json', $response3->getHeaderLine('Content-Type')); 
    }

    public function test_InvalidInputs_ReturnsContentTypeApplicationJson(){
        $response1 = $this->http->request('GET', '/', ['http_errors' => false]);
        $response2 = $this->http->request('GET', '/?x=foo&y=bar', ['http_errors' => false]);
        $response3 = $this->http->request('GET', '/?x=4.2&y=2.2', ['http_errors' => false]);

        $this->assertEquals('application/json', $response1->getHeaderLine('Content-Type')); 
        $this->assertEquals('application/json', $response2->getHeaderLine('Content-Type')); 
        $this->assertEquals('application/json', $response3->getHeaderLine('Content-Type')); 
    }


    public function test_ValidInputs_ReturnsCorrectBody(){
        $response1 = $this->http->request('GET', '/?x=4&y=2', ['http_errors' => false]);
        $response2 = $this->http->request('GET', '/?x=-4&y=-2', ['http_errors' => false]);
        $response3 = $this->http->request('GET', '/?x=4&y=-2', ['http_errors' => false]);

        $this->assertEquals('{"error":false,"string":"4+2=6","answer":6}', $response1->getBody()->getContents()); 
        $this->assertEquals('{"error":false,"string":"-4+-2=-6","answer":-6}', $response2->getBody()->getContents()); 
        $this->assertEquals('{"error":false,"string":"4+-2=2","answer":2}', $response3->getBody()->getContents()); 
    }

    public function test_InvalidInputs_ReturnsCorrectBody(){
        $response1 = $this->http->request('GET', '/', ['http_errors' => false]);
        $response2 = $this->http->request('GET', '/?x=foo&y=bar', ['http_errors' => false]);
        $response3 = $this->http->request('GET', '/?x=4.2&y=2.2', ['http_errors' => false]);

        $this->assertEquals('{"error":true,"string":"One or both required parameters (x and y) are missing.","answer":0}', $response1->getBody()->getContents()); 
        $this->assertEquals('{"error":true,"string":"One or both required parameters (x and y) are non numeric.","answer":0}', $response2->getBody()->getContents()); 
        $this->assertEquals('{"error":true,"string":"One or both required parameters (x and y) are not whole numbers.","answer":0}', $response3->getBody()->getContents()); 
    }

    //Unit Tests

    function test_add_bothPos(){
        $x=10;
        $y=5;
        $expect=15;
    
        $answer=add($x,$y);
    
        echo "Test Result: ".$x."+".$y."=".$answer." (expected: ".$expect.")\n";
    
        $this->assertEquals($answer, $expect);
    
    }
    
    function test_add_bothNeg(){
        $x=-10;
        $y=-5;
        $expect=-15;
    
        $answer=add($x,$y);
    
        echo "Test Result: ".$x."+".$y."=".$answer." (expected: ".$expect.")\n";
    
        $this->assertEquals($answer, $expect);
    
    }
    
    function test_add_onePosOneNeg(){
        $x=-10;
        $y=5;
        $expect=-5;
    
        $answer=add($x,$y);
    
        echo "Test Result: ".$x."+".$y."=".$answer." (expected: ".$expect.")\n";
    
        $this->assertEquals($answer, $expect);
    
    }

}