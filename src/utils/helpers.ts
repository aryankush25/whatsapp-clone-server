import * as R from 'ramda';

// GLOBALLY USED FUNCTIONS
export const isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty]);
export const isPresent = R.complement(isNilOrEmpty);
export const removeNullOrEmptyKeys = (object: any) =>
  R.filter((value: any) => !(isNilOrEmpty(value) || value === -1), object);

// FOR WEB SOCKETS
export const createWebSocketUpdatePayload = (type: string, payload: Object) =>
  createSuccessResponse({ type, data: payload });

// FOR API RESPONSE
export const createSuccessResponse = (data: Object) => ({ isSuccess: true, data });
export const createErrorResponse = (error: Object) => ({ isSuccess: false, error });
