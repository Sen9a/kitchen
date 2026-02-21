from dataclasses import dataclass, field

from src.managers import UserManager
from src.schemas import User
from src.services.base_service import BaseService


@dataclass
class UserService(BaseService[User]):
    manager: 'UserManager' = field(default_factory=UserManager)