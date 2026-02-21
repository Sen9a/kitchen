from dataclasses import dataclass, field
from operator import attrgetter
from typing import Any, TYPE_CHECKING
from sqlalchemy import select, Select, func, cast, String, or_, and_, nullslast
from src.database import get_db_session

if TYPE_CHECKING:
    from sqlalchemy.orm import Query


class FilterOperations:
    DATE_FORMAT = 'YYYY-MM-DD'

    @staticmethod
    def eq(f, v) -> bool:
        return f == v

    @staticmethod
    def eq_key_sensitive(f, v):
        return func.lower(f) == func.lower(v)

    @staticmethod
    def qe(f, v) -> bool:
        return f >= v

    @staticmethod
    def le(f, v) -> bool:
        return f <= v

    @staticmethod
    def lt(f, v) -> bool:
        return f < v

    @staticmethod
    def gt(f, v) -> bool:
        return f > v

    @staticmethod
    def in_(f, v) -> bool:
        return f.in_(v)

    @staticmethod
    def not_in(f, v) -> bool:
        return f.notin_(v)

    @staticmethod
    def is_(f, v) -> bool:
        return f.is_(v)

    @staticmethod
    def is_not(f, v) -> bool:
        return f.isnot(v)

    @staticmethod
    def i_like(f, v) -> bool:
        return f.ilike(v)

    @classmethod
    def i_like_cast(cls, f, v):
        return cls.i_like(cast(f, String), v)

    @classmethod
    def i_like_format_date_to_char(cls, f, v):
        return cls.i_like(func.to_char(f, cls.DATE_FORMAT), v)

class ComplexFilters:

    @staticmethod
    def or_(v):
        return or_(*v)

    @staticmethod
    def and_(v):
        return and_(*v)

@dataclass
class BaseManager:
    model: Any
    session_factory: Any = get_db_session
    filter_columns: dict[str, Any] = field(default_factory=dict, init=False, repr=False)

    @staticmethod
    async def build_filters(model, filters):
        return [item['op'](getattr(model, item['field'], ''), item['value']) for item in filters]

    async def build_complex_filters(self, search_attrs: dict[str, Any] | list[str]) -> tuple:
        attrs = ()
        if isinstance(search_attrs, dict):
            model = search_attrs.pop('model', None)
            for k, v in search_attrs.items():
                if hasattr(ComplexFilters, k):
                    attrs += (attrgetter(k)(ComplexFilters)(await self.build_complex_filters(v)),)
                else:
                    attrs += (*await self.build_filter_params(model=model, **{k: v}),)
        elif isinstance(search_attrs, list):
            for i in search_attrs:
                attrs += (await self.build_complex_filters(i))
        return attrs

    async def build_filter_params(self, model=None, **kwargs: Any) -> list[Any]:
        filters = []
        complex_filters = []
        if model is None:
            model = self.model
        for k, v in kwargs.items():
            if k in self.filter_columns:
                complex_filters.append(self.filter_columns[k](v))
            elif hasattr(model, k):
                filters.append(attrgetter(k)(model)==v)
        return [*filters, *await self.build_filters(model, complex_filters)]

    async def add_filters(self, query: Select, filters: dict[str, Any] | None) -> Select:
        if filters:
             query = query.where(*await self.build_complex_filters(filters))
        return query

    async def sort_by_field(self, query: 'Query', field_: str = "name.asc") -> 'Query':
        """Orders by given field."""
        order = "asc"
        if "." in field_:
            field_, order = field_.split(".")

        field_attr = getattr(self.model, field_, None)
        if field_attr is None:
            if field_ in query.selectable.columns:
                field_attr = query.selectable.columns.get(field_)
            else:
                raise ValueError(f'No field: {field_}')

        if order == "desc":
            query = query.order_by(nullslast(field_attr.desc()))
        else:
            query = query.order_by(nullslast(field_attr))

        return query

    async def create(self, payload: dict[str, Any]) -> Any:
        db_obj = self.model(**payload)
        async with self.session_factory() as session:
            session.add(db_obj)
            await session.flush()
            await session.refresh(db_obj)
        return db_obj

    async def get(self,
                  offset: int = 0,
                  limit: int = 100,
                  filters: dict[str, Any] | None = None,
                  order_by: list[str] | None = None) -> list[Any]:
        query = select(self.model).offset(offset).limit(limit)
        if filters:
            query = await self.add_filters(query, filters)
        if order_by:
            for sort_field in order_by:
                query = await self.sort_by_field(query, sort_field)
        async with self.session_factory() as session:
            result = await session.execute(query)
            return list(result.scalars().all())


    async def update(self, obj_id: int, payload: dict[str, Any]) -> Any | None:
        async with self.session_factory() as session:
            query = select(self.model).where(self.model.id == obj_id)
            result = await session.execute(query)
            db_obj = result.scalar_one_or_none()
            if not db_obj:
                return None
            
            for key, value in payload.items():
                setattr(db_obj, key, value)
            
            await session.flush()
            await session.refresh(db_obj)
        return db_obj

    async def delete(self, obj_id: int) -> bool:
        async with self.session_factory() as session:
            query = select(self.model).where(self.model.id == obj_id)
            result = await session.execute(query)
            db_obj = result.scalar_one_or_none()
            if db_obj:
                await session.delete(db_obj)
                await session.flush()
        return bool(db_obj)
