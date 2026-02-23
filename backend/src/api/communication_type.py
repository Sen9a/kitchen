from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Query

from src.services import CommunicationTypeService
from src.schemas import CommunicationType, CommunicationTypeCreate, CommunicationTypeUpdate, CommunicationTypeRead


router = APIRouter(prefix="/communication-types", tags=["communication-types"])

filter_payload_schema = Annotated[CommunicationTypeRead, Query()]

@router.post("/", response_model=CommunicationType, status_code=status.HTTP_201_CREATED)
async def create_communication_type(communication_type: CommunicationTypeCreate):
    service = CommunicationTypeService()
    return await service.create(communication_type)

@router.get("/", response_model=list[CommunicationType])
async def read_communication_types(filter_payload: filter_payload_schema) -> list[CommunicationType]:
    service = CommunicationTypeService()
    return await service.get_all(filter_payload)

@router.get("/{communication_type_id}", response_model=CommunicationType)
async def read_communication_type(communication_type_id: int):
    service = CommunicationTypeService()
    db_communication_type = await service.get(communication_type_id)
    if db_communication_type is None:
        raise HTTPException(status_code=404, detail="Communication type not found")
    return db_communication_type

@router.put("/{communication_type_id}", response_model=CommunicationType)
async def update_communication_type(communication_type_id: int, communication_type: CommunicationTypeUpdate):
    service = CommunicationTypeService()
    db_communication_type = await service.put(communication_type_id, communication_type)
    if db_communication_type is None:
        raise HTTPException(status_code=404, detail="Communication type not found")
    return db_communication_type

@router.delete("/{communication_type_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_communication_type(communication_type_id: int):
    service = CommunicationTypeService()
    success = await service.delete(communication_type_id)
    if not success:
        raise HTTPException(status_code=404, detail="Communication type not found")
    return None
