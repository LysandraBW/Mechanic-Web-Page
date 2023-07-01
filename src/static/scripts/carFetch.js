const MakeModel = {}

async function fetchModels(make, formatted = true) {
      if (!Object.hasOwn(MakeModel, make)) {
            const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`)
            const modelsData = await response.json()
            MakeModel[make] = modelsData.Results.map(model => (formatted) ? [model.Model_Name, model.Model_Name] : model.Model_Name)
      }
      
      return MakeModel[make]
}

async function fetchMakeModelYear(vin) {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json&modelyear=b`)
      const vinDecodedData = await response.json()

      return {
            make: vinDecodedData.Results[0].Make, 
            model: vinDecodedData.Results[0].Model, 
            modelYear: vinDecodedData.Results[0].ModelYear
      }
}

export {fetchModels, fetchMakeModelYear}