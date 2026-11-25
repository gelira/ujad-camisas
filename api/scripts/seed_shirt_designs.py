import asyncio
import json
import sys
from pathlib import Path

from pydantic import BaseModel, ConfigDict, TypeAdapter, ValidationError

PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.database import async_session_factory
from src.models import ShirtDesign

SEED_PATH = PROJECT_ROOT / 'seeds' / 'shirt_designs.json'


class ShirtDesignSeed(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')

    description: str
    value: int


SHIRT_DESIGN_SEED_ADAPTER = TypeAdapter(list[ShirtDesignSeed])


def validate_shirt_designs(data):
    return SHIRT_DESIGN_SEED_ADAPTER.validate_python(data)


async def save_shirt_designs(shirt_designs: list[ShirtDesignSeed]):
    try:
        async with async_session_factory() as session:
            async with session.begin():
                session.add_all(
                    ShirtDesign(
                        description=shirt_design.description,
                        value_in_cents=shirt_design.value,
                    )
                    for shirt_design in shirt_designs
                )
    except Exception as error:
        print(f'Erro ao salvar modelos de camisa no banco de dados: {error}')
        return False

    print(f'{len(shirt_designs)} modelo(s) de camisa salvo(s) com sucesso.')
    return True


def main():
    if not SEED_PATH.is_file():
        print(f'Arquivo de modelos de camisa não encontrado: {SEED_PATH}')
        return 1

    try:
        shirt_designs = json.loads(SEED_PATH.read_text(encoding='utf-8'))
    except json.JSONDecodeError as error:
        print(f'Erro: o arquivo contém JSON inválido: {error}')
        return 1
    except OSError as error:
        print(f'Erro ao ler o arquivo de modelos de camisa: {error}')
        return 1

    try:
        shirt_designs = validate_shirt_designs(shirt_designs)
    except ValidationError as error:
        print(f'Erro: conteúdo inválido no arquivo de modelos de camisa:\n{error}')
        return 1

    return 0 if asyncio.run(save_shirt_designs(shirt_designs)) else 1


if __name__ == '__main__':
    raise SystemExit(main())