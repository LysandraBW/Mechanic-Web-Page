export class Error {
      // k: Error Type
      // v: Error Function: This is used to generate error messages for said type.
      static ErrorMessageConfiguration = {}

      //k: Code Name
      //v[0]: Error Type
      //v[1]: External Information (Keywords): Used in error message generation.   
      static ErrorCodesConfiguration = {}
      
      constructor() {}
      
      // You're creating an error type (just a string that you can make up)
      // which is attached to a function used to generate error messages for errors
      // of the same type.
      // The error function should take in two parameters: inputLabel and keywords.
      // "inputLabel" is a string representing what the input should be referred to as.
      // "keywords" is an array of strings pertaining to what should be including in the error message. 
      // For example: "Name musn't include numbers or symbols."
      // "Name" is the "inputLabel". The "keywords" in this case were ["numbers", "symbols"].
      // What makes this into "Name musn't include numbers of symbols" is the error function passed
      // in for the type of this error.
      static ConfigureErrorMessage(errorType, errorTypeFunction) {
            Error.ErrorMessageConfiguration[errorType] = errorTypeFunction
      }

      // You're creating an error code that on its own can generate an error message because
      // it will provide an errorType (which should have been configured in the prior function)
      // that has an errorFunction used to generate error message. Furthermore, you can
      // pass in the keywords here so that you can create a specific error message for this 
      // error code. Error code is just there so that you can reference it in multiple places
      // without having to retype the errorType and keywords.
      // For example: errorCode = 404, errorType = "Type_State", keywords = "['email']"
      // This error code will produce error messages like: "Invalid <inputLabel>. Please enter valid email."
      static ConfigureErrorCode(errorCode, errorType, keywords = null) {
            Error.ErrorCodesConfiguration[errorCode] = [errorType, keywords]
      }

      // This method may not be perfect for every situation, but it's much easier than my past attempts
      // at creating an error message on the fly.
      static ErrorMessage({inputData, inputLabel, errorCodes}) {
            let errorMessage = ""
            let errorTypeKeyword = {}

            errorCodes.forEach(errorCode => {
                  const [errorType, keywords] = Error.ErrorCodesConfiguration[errorCode]
                  
                  // Separating error codes by its type
                  if (!Object.hasOwn(errorTypeKeyword, errorType)) 
                        errorTypeKeyword[errorType] = []
                  errorTypeKeyword[errorType].push(keywords)
            })

            for (const [errorType, keywords] of Object.entries(errorTypeKeyword))
                  errorMessage += Error.ErrorMessageConfiguration[errorType]({"inputData": inputData, "inputLabel": inputLabel, "keywords": keywords})
            return errorMessage
      }
}

// Stores the "constants"
export const ERROR = {}

// Both used to create "constants"
export function link(key, value = key) {
      ERROR[key] = value
}

export function linkBatch(o) {
      for (const [key, value] of Object.entries(o)) {
            ERROR[key] = value === null ? key : value
      }
}