from rest_framework.renderers import JSONRenderer


class UniformJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response") if renderer_context else None
        status_code = response.status_code if response else 200
        is_error = status_code >= 400

        wrapped = {
            "status": "error" if is_error else "success",
            "data": data if not is_error else {},
            "message": data.get("detail", "") if is_error and isinstance(data, dict) else "",
        }
        if is_error:
            wrapped["errors"] = data

        return super().render(wrapped, accepted_media_type, renderer_context)
