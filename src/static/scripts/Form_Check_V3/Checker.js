import * as co from "../../../data/constants.js"
import {fetchModels} from "../carFetch.js"

export const Compare = {
      [co.contact]: null, 
      [co.make]: null,
      [co.model]: null,
      [co.year]: null,
      [co.services]: null,
      [co.status]: null
}

export const Regex = {
      Symbol: /([^A-Za-z0-9 '-])/,
      Number: /([0-9])/,
      NonNumber: /([^0-9])/,
      Name: /^([A-Z]).*([A-Z])*$/i,
      Email: /^([\w\d])+@([\w\d])+.([A-Z])+$/i,
      Phone: /(\d){3}-(\d){3}-(\d){4}$/,
      VIN: /^[A-HJ-NPR-Z0-9]{17}$/i,
      Time: /^[0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}(:[0-9]{2})?$/,
      Date: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
      Cost: /^([0-9]{1,}(.[0-9]{2})?)$/
}

export const Functions = {
      Blank: (s) => {
            return s === undefined || s === null || s.trim().length <= 0
      },
      Match: (a, s) => {
            return a.includes(s)
      },
      Matches: (a, s) => {
            if (s.length == 0) return false
            for (let i = 0; i < s.length; i++)
                  if (!a.includes(s[i]))
                        return false
            return true
      },
      Exist: (a, v) => {
            if (Functions.Blank(v)) return [co.EC_00]
            if (!a.includes(v)) return [co.EC_10]
            return []
      },
      Exists: (a, v) => {
            if (Functions.Blank(v) || v.length == 0) return [co.EC_00]
            v = JSON.parse(v)
            if (!Functions.Matches(a, v)) return [co.EC_11]
            return []
      },
      Join: (w, a = "and", b = "and") => {
            if (w.length == 0) return null
            if (w.length == 1) return w[0]
            if (w.length == 2) return w.join(` ${a} `)
            return words.slice(0, -1).join(", ") + `, ${b}` + w[-1]
      }
}

export const Check = {
      Name: (s) => {
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (Regex.Symbol.test(s)) c.push(co.EC_02)
            if (Regex.Number.test(s)) c.push(co.EC_03)
            return c
      },
      Email: (s) => {
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (!Regex.Email.test(s)) c.push(co.EC_04)
            return c
      },
      Phone: (s) => {
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (!Regex.Phone.test(s)) c.push(co.EC_05)
            return c
      },
      VIN: (s) => {
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (!Regex.VIN.test(s)) return [co.EC_01]
            return c
      },
      ContactBy: (s) => {
            return Functions.Exist(Compare[co.contact], s)
      },
      Make: (s) => {
            return Functions.Exist(Compare[co.make], s)
      },
      Model: (s) => {
            return Functions.Exist(Compare[co.model], s)
      },
      Year: (s) => {
            return Functions.Exist(Compare[co.year], s)
      },
      Services: (s) => {
            return Functions.Exists(Compare[co.services], s)
      },
      DynamicModel: async (s, m) => {
            const models = await fetchModels(m, false)
            return Functions.Exist(models, s)
      },
      ID: (s) => {
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (Regex.NonNumber.test(s)) return [co.EC_09]
            return c
      },
      Date: (s) => {
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (!Regex.Date.test(s)) c.push(co.EC_06)
            return c
      },
      Time: (s) => {
            console.log(s)
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (!Regex.Time.test(s)) c.push(co.EC_07)
            return c
      },
      Status: (s) => {
            return Functions.Exist(Compare[co.status], s)
      },
      Cost: (s) => {
            let c = []
            if (Functions.Blank(s)) return [co.EC_00]
            if (!Regex.Cost.test(s)) return [co.EC_08]
            return c            
      },
      Boolean: (b) => {
            let c = []
            if (Functions.Blank(b)) return [co.EC_00]
            if (typeof b !== "boolean") return [co.EC]
      } 
}