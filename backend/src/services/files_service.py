import os
import uuid
from dataclasses import dataclass, field
from pathlib import Path

import aiofiles
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool

from src import settings
from src.managers import FileManager


@dataclass
class FilesService:
    storage_path: Path = Path(settings.STORAGE_PATH)
    avatar_path: Path = Path(settings.AVATAR_PATH)
    plane_path: Path = Path(settings.PLANE_PATH)
    manager: 'FileManager' = field(default_factory=FileManager)

    @staticmethod
    async def generate_file_name() -> str:
        return str(uuid.uuid4())

    @staticmethod
    async def get_file_extension(file: UploadFile):
        return Path(file.filename).suffix

    async def put_file(self, upload_file: UploadFile) -> Path:
        file = await self.get_file_url()
        async with aiofiles.open(str(file), "wb") as f:
            while content := await upload_file.read(1024 * 1024):
                await f.write(content)
        return file

    async def delete_file(self, file_name: str) -> bool:
        file = await self.get_file_url(file_name)
        if file:
            await run_in_threadpool(os.remove, file)
            return True
        return False
