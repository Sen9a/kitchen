from dataclasses import dataclass

from .base_manager import BaseManager
from src.models import CommunicationType

@dataclass
class CommunicationTypeManager(BaseManager):
    model: 'CommunicationType'= CommunicationType
