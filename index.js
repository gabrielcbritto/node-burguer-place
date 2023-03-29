const express = require('express')
const { REPL_MODE_SLOPPY } = require('repl')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())



const orders = []

const checkIdTrue = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(od => od.id === id)

    if (index < 0){
        return response.status(404).json({message:"Order not Found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const methodAndUrl = (request, response, next) => {
    console.log(`Method: ${request.method}`, `Url: ${request.url}`)
    next()
}
app.post('/order',methodAndUrl,(request, response) => {
    const { order, clientName, price} = request.body
    const orderF = { id: uuid.v4(), order, clientName, price, status: "Em prep"}
    orders.push(orderF)
    return response.json(orderF)
})



app.get ('/order', methodAndUrl,(request, response) => response.json(orders))

app.put('/order/:id', checkIdTrue, methodAndUrl, (request, response)=> {
    
    const id = request.orderId

    const {order, clientName, price} = request.body

    const index = request.orderIndex

    const updatedOrder = {id, order, clientName, price, status:"Em prep"}

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})


app.delete('/order/:id',methodAndUrl, checkIdTrue, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(201).json({message:"Order Deleted"})
})

app.get ('/order/:id',methodAndUrl, checkIdTrue, (request, response)=> {
    const index = request.orderIndex
    console.log(orders[index])
    return response.json(orders[index])
})

app.patch ('/order/:id',methodAndUrl, checkIdTrue, (request, response) => {
    const orderChanges = orders[request.orderIndex]
    orderChanges.status = "Pronto"
    console.log(orderChanges)
    return response.json(orderChanges) 
})

app.listen(port, () => {
    console.log(`👾☠🤖🐱‍🏍Server is running on port ${port}`)
})


