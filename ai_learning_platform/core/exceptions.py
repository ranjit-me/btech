from rest_framework.views import exception_handler
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            "status": "error",
            "message": "An error occurred.",
            "errors": response.data,
            "data": {},
        }
        if isinstance(response.data, dict) and "detail" in response.data:
            error_data["message"] = str(response.data["detail"])

        response.data = error_data
        logger.error(f"API Error: {exc.__class__.__name__} - {exc}")

    return response
