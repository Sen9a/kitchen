import inspect


class BaseValidator:
    validate_pattern: str = 'validate_'

    async def validate(self) -> list[dict[str, str]]:
        validation_errors: list[dict[str, str]] = []
        methods = [name
                   for name, func in inspect.getmembers(self, predicate=inspect.iscoroutinefunction)
                   if name.startswith(self.validate_pattern)]
        for method in methods:
            error = await getattr(self, method)()
            if error:
                validation_errors.append(error)
        return validation_errors
