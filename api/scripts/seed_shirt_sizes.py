import asyncio
import json
import sys
from pathlib import Path

from pydantic import BaseModel, ConfigDict, TypeAdapter, ValidationError

PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.database import async_session_factory
from src.models import ShirtSize

SEED_PATH = PROJECT_ROOT / 'seeds' / 'shirt_sizes.json'


class ShirtSizeSeed(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')

    description: str
    order_to_show: int


SHIRT_SIZE_SEED_ADAPTER = TypeAdapter(list[ShirtSizeSeed])


def validate_shirt_sizes(data):
    return SHIRT_SIZE_SEED_ADAPTER.validate_python(data)


async def save_shirt_sizes(shirt_sizes: list[ShirtSizeSeed]):
    try:
        async with async_session_factory() as session:
            async with session.begin():
                session.add_all(
                    ShirtSize(**shirt_size.model_dump())
                    for shirt_size in shirt_sizes
                )
    except Exception as error:
        print(f'Erro ao salvar tamanhos de camisa no banco de dados: {error}')
        return False

    print(f'{len(shirt_sizes)} tamanho(s) de camisa salvo(s) com sucesso.')
    return True


def main():
    if not SEED_PATH.is_file():
        print(f'Arquivo de tamanhos de camisa não encontrado: {SEED_PATH}')
        return 1

    try:
        shirt_sizes = json.loads(SEED_PATH.read_text(encoding='utf-8'))
    except json.JSONDecodeError as error:
        print(f'Erro: o arquivo contém JSON inválido: {error}')
        return 1
    except OSError as error:
        print(f'Erro ao ler o arquivo de tamanhos de camisa: {error}')
        return 1

    try:
        shirt_sizes = validate_shirt_sizes(shirt_sizes)
    except ValidationError as error:
        print(f'Erro: conteúdo inválido no arquivo de tamanhos de camisa:\n{error}')
        return 1

    return 0 if asyncio.run(save_shirt_sizes(shirt_sizes)) else 1


if __name__ == '__main__':
    raise SystemExit(main())