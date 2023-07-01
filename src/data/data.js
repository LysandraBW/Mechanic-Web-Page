import * as co from "./constants.js"

const DATA = {
      [co.contact]: 
            [
                  ["Call", "call"], 
                  ["Text", "text"], 
                  ["Email", "email"]
            ],
      [co.status]: 
            [
                  ["Unscheduled", "unscheduled"], 
                  ["Scheduled", "scheduled"], 
                  ["In Progress", "inProgress"], 
                  ["Completed", "completed"]
            ],
      [co.year]: years(2023,1981),
      [co.make]: 
            [
                  ["Acura", "ACURA"],
                  ["Audi", "AUDI"],
                  ["Bentley", "BENTLEY"],
                  ["BMW", "BMW"], 
                  ["Cadillac", "CADILLAC"],
                  ["Chevrolet", "CHEVROLET"], 
                  ["Chrysler", "CHRYSLER"],
                  ["Dodge", "DODGE"], 
                  ["Ford", "FORD"], 
                  ["GMC", "GMC"],
                  ["Jeep", "JEEP"],
                  ["Honda", "HONDA"], 
                  ["Nissan", "NISSAN"],
                  ["Infiniti", "INFINITI"],
                  ["KIA", "KIA"],
                  ["Mercedes-Benz", "MERCEDES-BENZ"],
                  ["Toyota", "TOYOTA"],
                  ["Subaru", "SUBARU"],
                  ["Mazda", "MAZDA"],

            ],
      [co.services]: 
            [
                  ["General Repair", "General_Repair"],
                  ["Vehicle Check-up", "Checkup"],
                  ["Oil Change", "Oil_Change"],
                  ["Engine Repair", "Service_One"], 
                  ["Transmission Repair", "Transmission_Repair"], 
                  ["Interior Detailing", "Interior_Detailing"],
                  ["Exterior Detailing", "Exterior_Detailing"],
                  ["Tire Rotation", "Tire_Rotation"],
                  ["AC Repair", "AC_Repair"],
                  ["Electrical Repair", "Electrical_Repair"],
                  ["Not Sure", "Not_Sure"]
            ]
}

export const REQUIREMENTS = {
      [co.ID]: ["ID"],
      [co.fName]: ["name"],
      [co.lName]: ["name"],
      [co.email]: ["email"],
      [co.phone]: ["phone"],
      [co.contact]: ["contact"],
      [co.VIN]: ["VIN"],
      [co.make]: ["make"],
      [co.model]: [["dynamicModel", [null]]],
      [co.year]: ["year"],
      [co.services]: ["services"],
      [co.date]: ["date"],
      [co.time]: ["time"],
      [co.status]: ["status"],
      [co.cost]: ["cost"],
      [co.seen]: ["seen"],
      [co.mark]: ["mark"],
      "action": [],
      "appointment": [],
      "IDs": []
}

export function getLabelData(name) {
      return DATA[name]
}

export function getLabel(name) {
      return DATA[name].map(d => d[0])
}

export function getData(name) {
      return DATA[name].map(d => d[1])
}

export function getLabelFromData(name, s) {
      for (const data of DATA[name]) {
            if (data[1] === s)
                  return data[0]
      }
      return null
}

export const callback = {
      initializeModel: (data) => {
            REQUIREMENTS[co.model][0][1][0] = data[co.make]
      }
}

function years(newestYear, oldestYear, formatted = true) {
      let years = []
      for (let i = newestYear; i >= oldestYear; i -= 1)
            years.push(formatted ? [String(i), String(i)] : String(i))
      return years
}