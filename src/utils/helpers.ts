import * as R from 'ramda';

// GLOBALLY USED FUNCTIONS
export const isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty]);
export const isPresent = R.complement(isNilOrEmpty);
export const removeNullOrEmptyKeys = (object: any) =>
  R.filter((value: any) => !(isNilOrEmpty(value) || value === -1), object);

// FOR WEB SOCKETS
export const createWebSocketUpdatePayload = (type: string, payload: Object) => ({ type, data: payload });

// FOR API RESPONSE
export const createSuccessResponse = (payload: Object) => ({ isSuccess: true, data: payload });
export const createErrorResponse = (payload: Object) => ({ isSuccess: false, data: payload });
