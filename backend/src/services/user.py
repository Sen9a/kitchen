from dataclasses import dataclass, field

from src.managers import UserManager
from src.services.base_service import BaseService


@dataclass
class UserService(BaseService):
    manager: 'UserManager' = field(default_factory=UserManager)