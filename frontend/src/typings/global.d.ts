declare global {
  interface UserInfo {
    nome: string
    email: string
    picture: string
    admin: boolean
  }

  interface Setor {
    id: string
    nome: string
  }

  interface Modelo {
    id: string
    descricao: string
    valor: number
  }

  interface Tamanho {
    id: string
    descricao: string
  }

  interface Camisa {
    id: string
    nomePessoa: string
    modeloId: string
    modeloDescricao: string
    modeloValor: number
    totalPago: number
    tamanhoId: string
    tamanhoDescricao: string
  }

  interface Remessa {
    id: string
    descricao: string
    abertoManual: boolean
    inicio: string
    final: string
  }

  interface RemessaItem {
    id: string
    descricao: string
  }
  
  interface CreateCamisa {
    setorId: string
    nomePessoa: string
    modeloId: string
    tamanhoId: string
    totalPago: number
  }
  
  interface UpdateCamisa {
    nomePessoa: string
    modeloId: string
    tamanhoId: string
    totalPago: number
  }
}

export { }

