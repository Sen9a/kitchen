from dataclasses import dataclass
from typing import Any

from src.managers.base_manager import BaseManager, FilterOperations
from src.models import Squad


@dataclass
class SquadsManager(BaseManager):
    model: 'Squad' = Squad
    filter_columns = {'id_in': lambda v : {'field' : 'id', 'op': FilterOperations.in_, 'value' : v},
                      'name_ilike': lambda v : {'field' : 'name', 'op': FilterOperations.i_like, 'value' : v}}


