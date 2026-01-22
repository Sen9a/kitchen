import os
from dataclasses import dataclass

import aiofiles
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool


@dataclass
class FilesService:
    file_url: str = "static/uploads/"


    async def get_file_url(self, file_name: str) -> str:
        return self.file_url + file_name

    async def put_file(self, file_name: str,
                       upload_file: UploadFile,
                       ) -> str:
        file = await self.get_file_url(file_name)
        async with aiofiles.open(file, "wb") as f:
            while content := await upload_file.read(1024 * 1024):
                await f.write(content)
        return file

    async def delete_file(self, file_name: str) -> bool:
        file = await self.get_file_url(file_name)
        if file:
            await run_in_threadpool(os.remove, file)
            return True
        return False
