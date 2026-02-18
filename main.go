// main.go
package main

import (
    _ "embed"
    "fmt"
    "log"
)

//go:embed README.md
var data string

func main() {
    if data == "" {
        log.Fatal("README.md content is empty")
    }
    fmt.Print(data)
}
