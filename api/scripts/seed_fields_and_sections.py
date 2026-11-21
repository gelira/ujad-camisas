import asyncio
import json
import sys
from pathlib import Path

from pydantic import BaseModel, ConfigDict, TypeAdapter, ValidationError

PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.database import async_session_factory
from src.models import Field, Section

SEED_PATH = PROJECT_ROOT / 'seeds' / 'fields_and_sections.json'


class FieldSeed(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')

    field: str
    sections: list[str]


FIELD_SEED_ADAPTER = TypeAdapter(list[FieldSeed])


def validate_fields(data):
    return FIELD_SEED_ADAPTER.validate_python(data)


async def save_fields(fields: list[FieldSeed]):
    try:
        seed_fields = [
            Field(
                name=field.field,
                sections=[Section(name=section) for section in field.sections],
            )
            for field in fields
        ]

        async with async_session_factory() as session:
            async with session.begin():
                session.add_all(seed_fields)
    except Exception as error:
        print(f'Erro ao salvar campos e seções no banco de dados: {error}')
        return False

    section_count = sum(len(field.sections) for field in fields)
    print(
        f'{len(fields)} campo(s) e {section_count} seção(ões) '
        'salvo(s) com sucesso.'
    )
    return True


def main():
    if not SEED_PATH.is_file():
        print(f'Arquivo de campos e seções não encontrado: {SEED_PATH}')
        return 1

    try:
        fields = json.loads(SEED_PATH.read_text(encoding='utf-8'))
    except json.JSONDecodeError as error:
        print(f'Erro: o arquivo contém JSON inválido: {error}')
        return 1
    except OSError as error:
        print(f'Erro ao ler o arquivo de campos e seções: {error}')
        return 1

    try:
        fields = validate_fields(fields)
    except ValidationError as error:
        print(f'Erro: conteúdo inválido no arquivo de campos e seções:\n{error}')
        return 1

    return 0 if asyncio.run(save_fields(fields)) else 1


if __name__ == '__main__':
    raise SystemExit(main())