from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


class AppError(Exception):
    status_code = 400

    def __init__(self, detail: str | None = None):
        self.detail = detail or self.__class__.__name__
        super().__init__(self.detail)


class BadRequestError(AppError):
    status_code = 400


class UnauthorizedError(AppError):
    status_code = 401


class NotFoundError(AppError):
    status_code = 404


class ConflictError(AppError):
    status_code = 409


class ServerError(AppError):
    status_code = 500


class EmailAlreadyRegisteredError(ConflictError):
    pass


class RoleNotFoundError(ServerError):
    pass


class DatabaseTransactionError(ServerError):
    pass


class UserNotFoundError(NotFoundError):
    pass


class InvalidOTPError(BadRequestError):
    pass


class OTPExpiredError(BadRequestError):
    pass


class InvalidTokenError(UnauthorizedError):
    pass


class NotAuthenticatedError(UnauthorizedError):
    pass


class CardNotFoundError(NotFoundError):
    pass


class CardTypeNotFoundError(BadRequestError):
    pass


class WalletNotFoundError(BadRequestError):
    pass


class TransactionNotFoundError(NotFoundError):
    pass


class TemplateNotFoundError(NotFoundError):
    pass


class TemplateExecutionError(BadRequestError):
    pass


class InvalidPinError(UnauthorizedError):
    pass


def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
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
            if msg.startswith("Value error, "):
                msg = msg.replace("Value error, ", "")
            if msg not in error_messages:
                error_messages.append(msg)

        return JSONResponse(
            status_code=422,
            headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
            content={"detail": errors, "messages": error_messages},
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
        )

