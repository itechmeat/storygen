import Dexie, { Table } from 'dexie'
import { IScene } from '../features/scene/type'
import { IStory } from '../features/story/type'

const dbName = 'storygen'

interface IDexieDB extends Dexie {
  stories: Table<IStory>
  scenes: Table<IScene>
}

class MyDexieDB extends Dexie implements IDexieDB {
  stories!: Table<IStory>
  scenes!: Table<IScene>

  constructor() {
    super(dbName)
    this.version(1).stores({
      stories: 'id',
      scenes: 'id, storyId',
    })
  }
}

export const localDB = new MyDexieDB()

export const clearDatabase = () => {
  Dexie.delete(dbName)
    .then(() => {
      console.log(`Database "${dbName}" deleted successfully.`)
    })
    .catch(error => {
      console.error(`Failed to delete database "${dbName}".`, error)
    })
}
