package main

import (
	"log"
	"strconv"
	"net/http"
	"encoding/json"
)

type Output struct {
	Error bool`json:"error"`
	String string `json:"string"`
	Answer int `json:"answer"`
}

type DiscoveryOutput struct {
	Operator string `json:"operator"`
}

func HandleModuloRequest(w http.ResponseWriter, r *http.Request){	
	statusCode := 200

	query := r.URL.Query()
	x := query.Get("x")
	y := query.Get("y")

	jsonResponse := validateInputs(x,y)

	if (jsonResponse.Error == true){
		statusCode = 400
	} else {
		x_int, _ := strconv.Atoi(x)
		y_int, _ :=strconv.Atoi(y)

		answer := Modulo(x_int, y_int)
		jsonResponse.Answer = answer
		jsonResponse.Error = false
		jsonResponse.String = x+" modulo "+y+"="+strconv.Itoa(answer)
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	
	if (statusCode == 200){
		w.WriteHeader(http.StatusOK)
	}else{
		w.WriteHeader(http.StatusBadRequest)
	}
	

	json.NewEncoder(w).Encode(jsonResponse)
}

func HandleDiscoveryRequest(w http.ResponseWriter, r *http.Request){	
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	
	w.WriteHeader(http.StatusOK)

	jsonResponse := DiscoveryOutput{
		Operator: "mod",
	}

	json.NewEncoder(w).Encode(jsonResponse)
}


func HandleRequest(){
	http.HandleFunc("/", HandleModuloRequest)
	http.HandleFunc("/discovery", HandleDiscoveryRequest)

	log.Fatal(http.ListenAndServe(":8081", nil))
}

func validateInputs(x string, y string) Output {
	jsonResponse := Output{
		Error: false,
		String: "",
		Answer: 0,
	}

	//Check inputs not null
	//Check input are numeric
	//Check inputs are whole numbers

	if (x == "" || y == ""){
		jsonResponse = Output{
			Error: true,
			String: "One or both required parameters (x and y) are missing.",
			Answer: 0,
		}
	} else if(!isNumeric(x) || !isNumeric(y)) {
		jsonResponse = Output{
			Error: true,
			String: "One or both required parameters (x and y) are non numeric.",
			Answer: 0,
		}
	} else if(!isInteger(x) || !isInteger(y)) {
		jsonResponse = Output{
			Error: true,
			String: "One or both required parameters (x and y) are not whole numbers.",
			Answer: 0,
		}
	}
	

	return jsonResponse;
}

func main(){
	HandleRequest()
}