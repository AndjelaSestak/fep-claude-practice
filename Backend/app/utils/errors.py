from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

class EmailAlreadyRegisteredError(Exception):
    pass

class RoleNotFoundError(Exception):
    pass

class DatabaseTransactionError(Exception):
    pass

class UserNotFoundError(Exception):
    pass

class InvalidOTPError(Exception):
    pass

class OTPExpiredError(Exception):
    pass

def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(EmailAlreadyRegisteredError)
    async def email_registered_handler(request: Request, exc: EmailAlreadyRegisteredError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
        )

    @app.exception_handler(RoleNotFoundError)
    async def role_not_found_handler(request: Request, exc: RoleNotFoundError):
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )

    @app.exception_handler(DatabaseTransactionError)
    async def database_transaction_handler(request: Request, exc: DatabaseTransactionError):
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        # Extract messages from Pydantic errors and format them as a single string
        error_messages = []
        for err in exc.errors():
            msg = err.get("msg", "Validation error")
            # Clean up the "Value error, " prefix from model validators if it exists
            if msg.startswith("Value error, "):
                msg = msg.replace("Value error, ", "")
            error_messages.append(msg)
            
        return JSONResponse(
            status_code=422,
            content={"detail": " | ".join(error_messages)}
        )
    
    @app.exception_handler(UserNotFoundError)
    async def user_not_found_handler(request: Request, exc: UserNotFoundError):
        return JSONResponse(
            status_code=404, # Standard za "ne postoji"
            content={"detail": str(exc)},
        )

    @app.exception_handler(InvalidOTPError)
    async def invalid_otp_handler(request: Request, exc: InvalidOTPError):
        return JSONResponse(
            status_code=400, # Bad Request
            content={"detail": str(exc)},
        )

    @app.exception_handler(OTPExpiredError)
    async def otp_expired_handler(request: Request, exc: OTPExpiredError):
        return JSONResponse(
            status_code=400, # Ili 410 (Gone), ali 400 je sasvim okej
            content={"detail": str(exc)},
        )
