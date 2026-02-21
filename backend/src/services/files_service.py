import os
from dataclasses import dataclass
from pathlib import Path

import aiofiles
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool

from src import settings


@dataclass
class FilesService:
    file_url: Path = Path(settings.IMAGE_PATH)

    async def get_file_url(self, file_name: str) -> Path:
        return self.file_url / file_name

    async def put_file(self, upload_file: UploadFile) -> Path:
        file = await self.get_file_url(upload_file.filename)
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
