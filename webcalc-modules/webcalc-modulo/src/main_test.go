package main

import (
	"testing"
	"strconv"
	"net/http"
	"net/http/httptest"
	"strings"
)

type ModuloResult struct {
	x int
	y int
	expected int
}

var moduloResults = []ModuloResult{
	{4,3,1},
	{8,7,1},
	{7,8,7},
	{4,2,0},
	{6,-2,0},
	{-6,-2,0},
	{-6,2,0},
}


//||--Unit Tests--||

func TestModulo(t *testing.T){
	for _, test := range moduloResults {
		result := Modulo(test.x, test.y)
		if result != test.expected {
			t.Fatal("Failed. Expected:"+ string(test.expected)+"\nActual:"+strconv.Itoa(result))
		}
	}
}

//||--Inegration Tests--||

//<--Response Codes-->



func Test_ValidInput_Returns200ResponseCode(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=8&y=2", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)


	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler retured wrong status code: got %v want %v",status,http.StatusOK)
	}
}
func Test_InValidInput_NoParams_Returns400ResponseCode(t *testing.T){
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)


	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler retured wrong status code: got %v want %v",status,http.StatusBadRequest)
	}
}


func Test_InValidInput_NonNumericParams_Returns400ResponseCode(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=foo&y=bar", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)


	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler retured wrong status code: got %v want %v",status,http.StatusBadRequest)
	}
}

func Test_InValidInput_NonIntegerParams_Returns400ResponseCode(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=4.2&y=2", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)


	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler retured wrong status code: got %v want %v",status,http.StatusBadRequest)
	}
}

//<--Response Bodies-->

func Test_ValidInput8And6_ReturnsCorrectBody(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=8&y=6", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	json_repsonse := strings.TrimRight(string(rr.Body.String()), "\n")

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler retured wrong status code: got %v want %v",status,http.StatusOK)
	}

	expected := `{"error":false,"string":"8 modulo 6=2","answer":2}`
	if json_repsonse != expected {
		t.Errorf("Failed. Handler returned unexpected body. \nReturned:%v \nExpected:%v", json_repsonse, expected)
	}
}

func Test_ValidInput8AndNeg3_ReturnsCorrectBody(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=8&y=-3", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	json_repsonse := strings.TrimRight(string(rr.Body.String()), "\n")

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler retured wrong status code: got %v want %v",status,http.StatusOK)
	}

	expected := `{"error":false,"string":"8 modulo -3=-1","answer":-1}`
	if json_repsonse != expected {
		t.Errorf("Failed. Handler returned unexpected body. \nReturned:%v \nExpected:%v", json_repsonse, expected)
	}
}

func Test_ValidInputNeg8AndNeg3_ReturnsCorrectBody(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=-8&y=-3", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	json_repsonse := strings.TrimRight(string(rr.Body.String()), "\n")

	expected := `{"error":false,"string":"-8 modulo -3=-2","answer":-2}`
	if json_repsonse != expected {
		t.Errorf("Failed. Handler returned unexpected body. \nReturned:%v \nExpected:%v", json_repsonse, expected)
	}
}

func Test_InValidInput_NoParams_ReturnsCorrectBody(t *testing.T){
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	json_repsonse := strings.TrimRight(string(rr.Body.String()), "\n")

	expected := `{"error":true,"string":"One or both required parameters (x and y) are missing.","answer":0}`
	if json_repsonse != expected {
		t.Errorf("Failed. Handler returned unexpected body. \nReturned:%v \nExpected:%v", json_repsonse, expected)
	}
}


func Test_InValidInput_NonNumericParams_ReturnsCorrectBody(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=foo&y=bar", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	json_repsonse := strings.TrimRight(string(rr.Body.String()), "\n")

	expected := `{"error":true,"string":"One or both required parameters (x and y) are non numeric.","answer":0}`
	if json_repsonse != expected {
		t.Errorf("Failed. Handler returned unexpected body. \nReturned:%v \nExpected:%v", json_repsonse, expected)
	}
}

func Test_InValidInput_NonIntegerParams_ReturnsCorrectBody(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=4&y=2.2", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	json_repsonse := strings.TrimRight(string(rr.Body.String()), "\n")

	expected := `{"error":true,"string":"One or both required parameters (x and y) are not whole numbers.","answer":0}`
	if json_repsonse != expected {
		t.Errorf("Failed. Handler returned unexpected body. \nReturned:%v \nExpected:%v", json_repsonse, expected)
	}
}

//<--Response Content Type -->
func Test_ValidInput8And6_ReturnsContentType(t *testing.T){
	req, err := http.NewRequest("GET", "/?x=8&y=6", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	if contentType := rr.Header().Get("Content-type"); contentType != "application/json" {
		t.Errorf("handler retured wrong status code: got %v want application/json",contentType)
	}

}

func Test_InValidInput_NoParams_ReturnsContentType(t *testing.T){
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleModuloRequest)

	handler.ServeHTTP(rr, req)

	if contentType := rr.Header().Get("Content-type"); contentType != "application/json" {
		t.Errorf("handler retured wrong status code: got %v want application/json",contentType)
	}

}