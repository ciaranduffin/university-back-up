package main

import("strconv")

func Modulo(x, y int) int {	
	var answer int = x%y
	if ((answer < 0 && y > 0) || (answer > 0 && y < 0)){
		return answer + y
	}
	
	return answer
}

func isNumeric(s string) bool {
	_, err := strconv.ParseFloat(s, 64)
	return err == nil
}

func isInteger(s string) bool {
	_, err := strconv.Atoi(s)
	return err == nil
}