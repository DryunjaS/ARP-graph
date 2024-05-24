const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")
require("dotenv").config()

app.use(cors())
app.use(express.json())

app.use(express.static(path.resolve(__dirname, "./dist")))

app.get("/", function (req, res) {
	res.sendFile(path.resolve(__dirname, "./dist", "index.html"))
})

const PORT = process.env.PORT || 4500
const SERVER_IP = process.env.SERVER_IP || "localhost"

app.listen(PORT, SERVER_IP, () =>
	console.log(`Server started ${SERVER_IP} on port ${PORT}`)
)
