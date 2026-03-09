from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing_inspection.introspection import AnnotationSource

from src.schemas.squads import Squad, SquadCreate, SquadUpdate, SquadRead
from src.services import SquadsService

router = APIRouter(prefix="/squads", tags=["squads"])

@router.post("/", response_model=Squad, status_code=status.HTTP_201_CREATED)
async def create_squad(squad: SquadCreate):
    service = SquadsService()
    return await service.create(squad)

@router.get("/", response_model=list[Squad])
async def read_squads(filter_payload: Annotated[SquadRead, Query()]):
    service = SquadsService()
    return await service.get_all(filter_payload)


@router.get("/{squad_id}", response_model=Squad)
async def read_squad(squad_id: int):
    service = SquadsService()
    db_squad = await service.get(squad_id)
    if db_squad is None:
        raise HTTPException(status_code=404, detail="Squad not found")
    return db_squad

@router.put("/{squad_id}", response_model=Squad)
async def update_squad(squad_id: int, squad: SquadUpdate):
    service = SquadsService()
    db_squad = await service.put(squad_id, squad)
    if db_squad is None:
        raise HTTPException(status_code=404, detail="Squad not found")
    return db_squad

@router.delete("/{squad_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_squad(squad_id: int):
    service = SquadsService()
    success = await service.delete(squad_id)
    if not success:
        raise HTTPException(status_code=404, detail="Squad not found")
    return None
