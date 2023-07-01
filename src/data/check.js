import {FormCheck} from "../static/scripts/Form_Check_V3/FormCheck.js"
import {REQUIREMENTS, callback} from "./data.js"

const FC = new FormCheck()

export async function checkData(data, callbackNames = []) {
      for (const callbackName of callbackNames) {
            callback[callbackName](data)
      }
      return FC.check({inputData: data, inputRequirements: REQUIREMENTS, strict: true})
}