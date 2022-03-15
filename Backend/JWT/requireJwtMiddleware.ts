import { Request, Response, NextFunction } from "express";
import { DecodeResult } from "./decodeResult";
import { decodeSession } from "./decodeSession";
import { ExpirationStatus } from "./expirationStatus";
import { Session } from "./session";
import { checkExpirationStatus } from "./checkExpirationStatus";
import { encodeSession } from "./encodeSession";
import * as HS512_key from '../Environment/HS512_key.json';


/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function requireJwtMiddleware(request: Request, response: Response, next: NextFunction) {
    const unauthorized = (message: string) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });

    const requestHeader = "authorization";
    const responseHeader = "authorization";

    let header = request.header(requestHeader)
    
    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }

    header = header.substring(7);

    const decodedSession: DecodeResult = decodeSession(HS512_key.key, header);
    
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }

    const expiration: ExpirationStatus = checkExpirationStatus(decodedSession.session);

    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }

    let session: Session;

    if (expiration === "grace") {
        // Automatically renew the session and send it back with the response
        const { token, expires, issued } = encodeSession(HS512_key.key, decodedSession.session);
        session = {
            ...decodedSession.session,
            expires: expires,
            issued: issued
        };

        response.setHeader(responseHeader, token);
    } else {
        session = decodedSession.session;
    }

    // Set the session on response.locals object for routes to access
    response.locals = {
        ...response.locals,
        session: session
    };

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}