import asyncio
import json
import sys
from pathlib import Path

from pydantic import BaseModel, ConfigDict, TypeAdapter, ValidationError

PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.database import async_session_factory
from src.models import User

SEED_PATH = PROJECT_ROOT / 'seeds' / 'users.json'


class UserSeed(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')

    name: str
    email: str
    admin: bool
    active: bool


USER_SEED_ADAPTER = TypeAdapter(list[UserSeed])


def validate_users(data):
    return USER_SEED_ADAPTER.validate_python(data)


async def save_users(users: list[UserSeed]):
    try:
        async with async_session_factory() as session:
            async with session.begin():
                session.add_all(User(**user.model_dump()) for user in users)
    except Exception as error:
        print(f'Erro ao salvar usuários no banco de dados: {error}')
        return False

    print(f'{len(users)} usuário(s) salvo(s) com sucesso.')
    return True


def main():
    if not SEED_PATH.is_file():
        print(f'Arquivo de usuários não encontrado: {SEED_PATH}')
        return 1

    try:
        users = json.loads(SEED_PATH.read_text(encoding='utf-8'))
    except json.JSONDecodeError as error:
        print(f'Erro: o arquivo contém JSON inválido: {error}')
        return 1
    except OSError as error:
        print(f'Erro ao ler o arquivo de usuários: {error}')
        return 1

    try:
        users = validate_users(users)
    except ValidationError as error:
        print(f'Erro: conteúdo inválido no arquivo de usuários:\n{error}')
        return 1

    return 0 if asyncio.run(save_users(users)) else 1

if __name__ == '__main__':
    raise SystemExit(main())
