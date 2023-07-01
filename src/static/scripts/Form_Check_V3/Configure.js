import * as co from "../../../data/constants.js"
import {Require} from "./Require.js"
import {Error} from "./Error.js"
import {Compare, Check, Functions} from "./Checker.js"
import {getData} from "../../../data/data.js"

// Configuring Requirements: 
// A string is linked to a function. 
// If the input's requirement contains one of these strings, said function will be called to verify the input.
Require.addBatch({
      ID: Check.ID,
      name: Check.Name,
      email: Check.Email,
      phone: Check.Phone,
      contact: Check.ContactBy,
      VIN: Check.VIN,
      make: Check.Make,
      model: Check.Model,
      dynamicModel: Check.DynamicModel,
      year: Check.Year,
      services: Check.Services,
      date: Check.Date,
      time: Check.Time,
      status: Check.Status,
      cost: Check.Cost,
      mark: Check.Boolean,
      seen: Check.Boolean
})

// Configuring Comparisons
Compare[co.services] = getData(co.services)
Compare[co.contact] = getData(co.contact)
Compare[co.status] = getData(co.status)
Compare[co.year] = getData(co.year)
Compare[co.make] = getData(co.make)

// Configuring Error Messages:
// I'm not sure what to say here. An error type (fundamentally a string) is attached to a function which essentially generates an error message.
Error.ConfigureErrorMessage(co.ET_MISSING, ({inputLabel, keywords}) => `${inputLabel} must include ${Functions.Join(keywords)}.`)
Error.ConfigureErrorMessage(co.ET_CONTAIN, ({inputLabel, keywords}) => `${inputLabel} musn't include ${Functions.Join(keywords)}.`)
Error.ConfigureErrorMessage(co.ET_STATE, ({inputLabel}) => `${inputLabel} is invalid.`)
Error.ConfigureErrorMessage(co.ET_BLANK, ({inputLabel}) => `${inputLabel} is blank. Please enter input.`)
Error.ConfigureErrorMessage(co.ET_UNSEL, ({keywords}) => `Make sure to select ${keywords}.`)

// Configuring Error Codes:
// The functions used for the requirements return error codes so that error messages can be generated.
Error.ConfigureErrorCode(co.EC_00, co.ET_BLANK)
Error.ConfigureErrorCode(co.EC_01, co.ET_STATE, "VIN")
Error.ConfigureErrorCode(co.EC_02, co.ET_CONTAIN, "symbols")
Error.ConfigureErrorCode(co.EC_03, co.ET_CONTAIN, "numbers")
Error.ConfigureErrorCode(co.EC_04, co.ET_STATE, "email")
Error.ConfigureErrorCode(co.EC_05, co.ET_STATE, "phone")
Error.ConfigureErrorCode(co.EC_06, co.ET_STATE, "date")
Error.ConfigureErrorCode(co.EC_07, co.ET_STATE, "time")
Error.ConfigureErrorCode(co.EC_08, co.ET_STATE, "cost")
Error.ConfigureErrorCode(co.EC_09, co.ET_MISSING, "only numbers")
Error.ConfigureErrorCode(co.EC_10, co.ET_UNSEL, "a valid option")
Error.ConfigureErrorCode(co.EC_11, co.ET_UNSEL, "only valid options")