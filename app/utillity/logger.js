const debug = true;

export function log(...args) {
  if (debug) {
    console.log('[DEBUG]', ...args);
  }
}

export function logResponse(methodName, response){
   log(`${methodName} → API Response:`, response.status, response.statusText);
}

export function logBody(methodName, body){
    log(`${methodName} → Request Body:`, body);
}

export function logParam(methodName, param){
    log(`${methodName} → Request Parameter:`, param);
}

export function logData(methodName, data){
     log(`${methodName} → Answer Data:`, data);
}


