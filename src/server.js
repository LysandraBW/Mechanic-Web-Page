import express from "express"
import path from "path"

import {dirname} from 'path'
import {fileURLToPath} from 'url'

import * as db from "./data/database.js"
import {checkData} from "./data/check.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 3500
const app = express()

app.use(express.static("./"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// Home
app.get('/', async (req, res) => {
      res.status(200).sendFile(path.resolve(__dirname, "pages/Home.html"))
})


// Schedule
app.get('/schedule', (req, res) => {
      res.status(200).sendFile(path.resolve(__dirname, "pages/Schedule.html"))
})

app.post('/schedule', async (req, res) => {
      const [good, errors] = await checkData(req.body, ["initializeModel"])
      
      if (!good) {
            res.status(400).json({"good": false, result: {"ID": -1}})
            return
      }     
      const ID = await db.createAppointment(req.body)
      res.status(200).json({"good": true, result: {"ID": ID}})
})


// Find
app.get('/find', (req, res) => {
      res.status(200).sendFile(path.resolve(__dirname, "pages/Find.html"))
})

app.post('/find', async (req, res) => {
      const [good, errors] = await checkData(req.body)
      if (!good) {
            res.status(400).json({"good": false})
            return
      }
      const appointment = await db.appointmentData(req.body)
      appointment.length === 0 ? res.status(400).json({"good": false, result: {"appointment": null}}) : res.status(200).json({"good": true, result: {"appointment": appointment[0]}})
})


// Dashboard
app.get('/dashboard', async (req, res) => {
      res.status(200).sendFile(path.resolve(__dirname, "pages/Dashboard.html"))
})


// Update Appointment
app.post('/appointments/mod', async (req, res) => {
      const [good, errors] = await checkData(req.body, ["initializeModel"])
            
      if (!good) {
            res.status(400).json({"good": false})
            return
      }

      console.log(req.body)
      
      switch (req.body.action) {
            case "UPDATE":
                  db.updateAppointment(req.body)
                  break
            case "DELETE":
                  db.deleteAppointment(req.body)
                  break
            case "DELETE_MULTIPLE":
                  db.deleteAppointments(req.body)
                  break
            case "MARK":
                  db.updateAppointmentMark(req.body)
                  break
            case "SEEN":
                  db.updateAppointmentSeen(req.body)
                  break
      }

      res.status(200).json({"good": true})
})

// Get Appointments by Status
app.post('/appointments/:status', async (req, res) => {
      const status = req.params.status
      const appointments = await db.getAppointments({"status": status})
      res.status(200).json({"good": true, result: {"appointments": appointments}})
})





app.listen(port, () => console.log(`Server Running on Port ${port}...`))