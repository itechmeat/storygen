import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { localDB } from '../../api/db'
import { UUID } from '../../types/common'
import { IScene } from './type'

type SceneState = {
  scenes: IScene[]
  fetchAllScenes: () => Promise<IScene[] | undefined>
  fetchSceneById: (id: UUID) => Promise<IScene | undefined>
  createScene: (scene: IScene) => Promise<IScene | undefined>
  updateScene: (id: UUID, updatedFields: Partial<IScene>) => void
  deleteScene: (id: UUID) => void
  getAllScenes: () => IScene[]
  getSceneById: (id?: UUID | null) => IScene | null
}

export const useSceneStore = create<SceneState>()(
  devtools((set, get) => ({
    scenes: [],
    fetchAllScenes: async () => {
      try {
        const scenes = await localDB.scenes.toArray()
        set({
          scenes: [...scenes],
        })
        return scenes
      } catch (err) {
        console.error('fetchAllScenes:', err)
      }
    },
    fetchSceneById: async (id: UUID) => {
      try {
        const scene = await localDB.scenes.get(id)
        if (scene) {
          set(state => ({
            scenes: [...state.scenes, scene],
          }))
          return scene
        }
      } catch (err) {
        console.error('fetchSceneById:', err)
      }
    },
    createScene: async (scene: IScene) => {
      try {
        set(state => ({
          scenes: [...state.scenes, scene],
        }))
        await localDB.scenes.add(scene)
        return scene
      } catch (err) {
        console.error('createScene:', err)
      }
    },
    updateScene: async (sceneId, updatedFields) => {
      try {
        set(state => ({
          scenes: state.scenes.map(scene =>
            scene.id === sceneId ? { ...scene, ...updatedFields } : scene,
          ),
        }))
        await localDB.scenes.update(sceneId, updatedFields)
      } catch (err) {
        console.error('updateScene:', err)
      }
    },
    deleteScene: async sceneId => {
      try {
        set(state => ({
          scenes: state.scenes.filter(scene => scene.id !== sceneId),
        }))

        await localDB.scenes.delete(sceneId)
      } catch (err) {
        console.error('deleteScene:', err)
      }
    },
    getAllScenes: () => {
      const { scenes } = get()
      return scenes
    },
    getSceneById: sceneId => {
      if (!sceneId) return null
      const { scenes } = get()
      return scenes.find(scene => scene.id === sceneId) || null
    },
  })),
)
