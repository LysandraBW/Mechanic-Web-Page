import mysql from "mysql2"
import * as co from "./constants.js"

const pool = mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: "Ardnasyl20!@who",
      database: "mechanic"
}).promise()

export async function createAppointment(data) {
      const ID = await udomID()

      await pool.query(`
            INSERT INTO appointments (
                  ID,
                  firstName, 
                  lastName, 
                  emailAddress, 
                  phoneNumber, 
                  contactBy, 
                  VIN, 
                  make, 
                  modelName, 
                  modelYear, 
                  services
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            ID, 
            data.firstName, 
            data.lastName, 
            data.emailAddress, 
            data.phoneNumber, 
            data.contactBy, 
            data.VIN, 
            data.make, 
            data.modelName, 
            data.modelYear, 
            data.services
      ])

      return ID
}

export async function appointmentData(data) {
      const appointmentData = await pool.query(`
            SELECT 
                  ID, 
                  firstName, 
                  lastName, 
                  make, 
                  modelName, 
                  modelYear, 
                  services,
                  apStatus, 
                  apDate, 
                  apTime, 
                  apCost 
            FROM 
                  appointments 
            WHERE 
                  ID = ? 
                  and 
                  emailAddress = ?
      `, [
            data.ID, 
            data.emailAddress
      ])
      return appointmentData[0]
}

async function appointmentIDs() {
      const result = await pool.query(`
            SELECT 
                  ID 
            FROM 
                  appointments
      `)
      return result[0].map(x => Number(x.id === null ? -1 : x.id))
}

export async function getAppointments(o) {
      let result = [null]
      if (o !== null && Object.hasOwn(o, "status")) {
            switch (o["status"]) {
                  case "all":
                        result = await pool.query(`SELECT * FROM appointments`)
                        break
                  case "seen":
                        result = await pool.query(`SELECT * FROM appointments WHERE statusSeen = "1"`)
                        break
                  case "unseen":
                        result = await pool.query(`SELECT * FROM appointments WHERE statusSeen = "0"`)
                        break
                  case "starred":
                        result = await pool.query(`SELECT * FROM appointments WHERE statusMark = "1"`)
                        break
                  default:
                        result = await pool.query(`SELECT * FROM appointments WHERE apStatus = '${o["status"]}'`)
                        break
            }     
      }
      return result[0]
}           

async function udomID() {
      const IDs = await appointmentIDs()
      let max = 100000, min = 100, id = -1

      do {
            id = Math.floor(Math.random() * (max - min) + min)
      } while (IDs.includes(id))

      return id
}

export async function updateAppointment(data) {
      const update = await pool.query(`
            UPDATE 
                  appointments
            SET 
                  firstName = ?,
                  lastName = ?,
                  emailAddress = ?,
                  phoneNumber = ?,
                  contactBy = ?,
                  VIN = ?,
                  make = ?,
                  modelName = ?,
                  modelYear = ?,
                  apStatus = ?,
                  apDate = ?,
                  apTime = ?,
                  apCost = ?,
                  services = ?
            WHERE
                  ID = ?
            `, [
                  data.firstName,
                  data.lastName,
                  data.emailAddress,
                  data.phoneNumber,
                  data.contactBy,
                  data.VIN,
                  data.make,
                  data.modelName,
                  data.modelYear,
                  data.apStatus,
                  data.apDate,
                  data.apTime,
                  data.apCost,
                  data.services,
                  data.ID
      ])
}


export async function deleteAppointment(body) {
      const del = await pool.query(`
            DELETE FROM 
                  appointments
            WHERE 
                  ID = ?
      `, [(typeof body === "object" ? body.ID : body)])
}

export async function deleteAppointments(body) {
      for (const ID of body.IDs)
            await deleteAppointment(ID)
}

export async function updateAppointmentSeen(body) {
      const query = await pool.query(`
            UPDATE 
                  appointments
            SET 
                  statusSeen = true
            WHERE 
                  ID = ?
      `, [body.appointment[co.ID]])
}

export async function updateAppointmentMark(body) {
      console.log(body)
      const query = await pool.query(`
            UPDATE 
                  appointments
            SET 
                  statusMark = ?
            WHERE 
                  ID = ?
      `, [!body.appointment[co.mark], body.appointment[co.ID]])
}