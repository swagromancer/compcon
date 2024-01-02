import { Damage } from './Damage'
import { HASE } from './enums'

interface ISavingThrowData {
  description: string
  hase: HASE
  damage?: Damage[]
  half?: boolean
  // TODO: Add ConditionStatus object (see issue #1742)
  // status?: ConditionStatus[]
}

class SavingThrow {
  public readonly Description: string
  public readonly Hase: HASE
  public readonly Damage: Damage[]
  public readonly Half: boolean

  public constructor(save: ISavingThrowData) {
    this.Description = save.description
    this.Hase = save.hase
    this.Damage = save.damage || []
    this.Half = save.half || false
  }
}

export { ISavingThrowData, SavingThrow }
