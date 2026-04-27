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

class InvalidTokenError(Exception):
    pass

class NotAuthenticatedError(Exception):
    pass

class CardNotFoundError(Exception):
    pass

class CardTypeNotFoundError(Exception):
    pass

class WalletNotFoundError(Exception):
    pass

class TransactionNotFoundError(Exception):
    pass

class TemplateNotFoundError(Exception):
    pass

class TemplateExecutionError(Exception):
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
        errors = []
        error_messages = []
        for err in exc.errors():
            errors.append({
                "type": err.get("type"),
                "loc": err.get("loc"),
                "msg": err.get("msg"),
                "input": err.get("input"),
            })
            msg = err.get("msg", "Validation error")
            # Clean up the "Value error, " prefix from model validators if it exists
            if msg.startswith("Value error, "):
                msg = msg.replace("Value error, ", "")
            if msg not in error_messages:
                error_messages.append(msg)  
            
        return JSONResponse(
            status_code=422,
            headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
            content={"detail": errors, "messages": error_messages}
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
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
            status_code=400, 
            content={"detail": str(exc)},
        )

    @app.exception_handler(OTPExpiredError)
    async def otp_expired_handler(request: Request, exc: OTPExpiredError):
        return JSONResponse(
            status_code=400, # Ili 410 (Gone), ali 400 je sasvim okej
            content={"detail": str(exc)},
        )

    @app.exception_handler(InvalidTokenError)
    async def invalid_token_handler(request: Request, exc: InvalidTokenError):
        return JSONResponse(
            status_code=401,
            content={"detail": str(exc)},
        )

    @app.exception_handler(NotAuthenticatedError)
    async def not_authenticated_handler(request: Request, exc: NotAuthenticatedError):
        return JSONResponse(
            status_code=401,
            content={"detail": str(exc)},
        )

    @app.exception_handler(CardNotFoundError)
    async def card_not_found_handler(request: Request, exc: CardNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc)},
        )

    @app.exception_handler(CardTypeNotFoundError)
    async def card_type_not_found_handler(request: Request, exc: CardTypeNotFoundError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
        )
    
    @app.exception_handler(WalletNotFoundError)
    async def wallet_not_found_handler(request: Request, exc: WalletNotFoundError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)}
        )
  
    @app.exception_handler(TransactionNotFoundError)
    async def transaction_not_found_handler(request: Request, exc: TransactionNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc)}
        )

    @app.exception_handler(TemplateNotFoundError)
    async def template_not_found_handler(request: Request, exc: TemplateNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc)}
        )

    @app.exception_handler(TemplateExecutionError)
    async def template_execution_error_handler(request: Request, exc: TemplateExecutionError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)}
        )

    @app.exception_handler(TemplateNotFoundError)
    async def template_not_found_handler(request: Request, exc: TemplateNotFoundError):
        return JSONResponse(
            status_code=404,
            content={"detail": str(exc)}
        )

    @app.exception_handler(TemplateExecutionError)
    async def template_execution_error_handler(request: Request, exc: TemplateExecutionError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)}
        )
