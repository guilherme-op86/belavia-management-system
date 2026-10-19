const addBill = () =>{
    const dataBase = JSON.parse(localStorage.getItem("dataBase")) || []

    const client = document.querySelector("#client").value
    const service = document.querySelector("#service").value
    const value = document.querySelector("#value").value
    const date = document.querySelector("#date").value
    const status = document.querySelector("#status").value

    const numericValue = currancyNumber(value)

    const newObject = {
        client: client,
        service: service,
        value: numericValue,
        date: date,
        status: status
    }

    if(edittingIndex != null){
        dataBase.splice(edittingIndex, 1, newObject)
        edittingIndex = null
        document.querySelector("#addButton").textContent = "Adicionar"

    }else{
        dataBase.push(newObject)
    }


    localStorage.setItem("dataBase", JSON.stringify(dataBase))

    updateTable()

    document.querySelector("#client").value = ""
    document.querySelector("#service").value = ""
    document.querySelector("#value").value = ""
    document.querySelector("#date").value = ""
    document.querySelector("#status").value = ""
}

const currancyNumber = (stringValue) =>{
    //removes everything except digit, dot, comma, dash
    stringValue = stringValue.replace(/[^\d.,-]/g, "")

    stringValue = stringValue.replace(",", ".")

    const number = parseFloat(stringValue)
    return isNaN(number) ? 0 : number
}

const valueToCurrency = (valueNumber) =>{
    return valueNumber.toLocaleString("pt-br", {
        style:"currency",
        currency: "BRL"
    })
}

const updateTable = () =>{
    const tableBody = document.querySelector("#tableBody")
    
    tableBody.innerHTML = ""

    const dataBase = JSON.parse(localStorage.getItem("dataBase")) || []

    dataBase.forEach((entry, index) =>{
        const newLine = document.createElement("tr")

        const clientCell = document.createElement("td")
        clientCell.textContent = entry.client
        newLine.appendChild(clientCell)

        const serviceCell = document.createElement("td")
        serviceCell.textContent = entry.service
        newLine.appendChild(serviceCell)

        const valueCell = document.createElement("td")
        valueCell.textContent = valueToCurrency(entry.value)
        newLine.appendChild(valueCell)

        const [year, month, day] = entry.date.split("-")
        const formatedDate = `${day}/${month}/${year}`

        const dateCell = document.createElement("td")
        dateCell.textContent = formatedDate
        newLine.appendChild(dateCell)

        const statusCell = document.createElement("td")
        statusCell.textContent = entry.status === "paid" ? "Pago" : "Pendente"
        newLine.appendChild(statusCell)

        if(entry.status === "pending"){
            statusCell.classList.add("status-pending")
        }else{
            statusCell.classList.add("status-paid")
        }

        const actionCell = document.createElement("td")

        const editButton = document.createElement("button")
        editButton.textContent = "Editar"
        editButton.classList.add("editBtn")
        editButton.addEventListener("click", () =>{
            editBill(index)
        })

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Deletar"
        deleteBtn.classList.add("deleteBtn")
        deleteBtn.addEventListener("click", () =>{
            deleteBill(index)
        })

        actionCell.appendChild(editButton)
        actionCell.appendChild(deleteBtn)

        newLine.appendChild(actionCell)

        tableBody.appendChild(newLine)
     })
}

const deleteBill = (index) =>{
    const dataBase = JSON.parse(localStorage.getItem("dataBase"))

    dataBase.splice(index, 1)

    localStorage.setItem("dataBase", JSON.stringify(dataBase))

    updateTable()
}

let edittingIndex

const editBill = (index) =>{
    const clientInput = document.querySelector("#client")
    const serviceInput = document.querySelector("#service")
    const valueInput = document.querySelector("#value")
    const dateInput = document.querySelector("#date")
    const statusInput = document.querySelector("#status")
    const addBtn = document.querySelector("#addButton")

    const dataBase = JSON.parse(localStorage.getItem("dataBase"))

    const itemSelected = dataBase[index]

    clientInput.value = itemSelected.client
    serviceInput.value = itemSelected.service
    valueInput.value = itemSelected.value
    dateInput.value = itemSelected.date
    statusInput.value = itemSelected.status

    addBtn.textContent = "Salvar"

    edittingIndex = index
}

document.querySelector("#addButton").addEventListener("click", () =>{
    addBill()
})

window.addEventListener("load", () =>{
    updateTable()
})