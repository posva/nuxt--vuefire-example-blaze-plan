import type { DataSnapshot } from 'firebase/database'
import type { DocumentData } from 'firebase/firestore'
import {
  VueDatabaseDocumentData,
  VueFirestoreDocumentData,
  globalDatabaseOptions,
  globalFirestoreOptions,
} from 'vuefire'

export default defineNuxtPlugin(() => {
  globalFirestoreOptions.converter = {
    toFirestore(data) {
      // this is okay because we declare other properties as non-enumerable
      // @ts-expect-error: id might not exist
      const { id, ...rest } = data as VueFirestoreDocumentData
      return rest as DocumentData
    },
    fromFirestore(snapshot, options) {
      return snapshot.exists()
        ? (Object.defineProperties(snapshot.data(options)!, {
            id: { value: snapshot.id, enumerable: true, configurable: true },
            // TODO: check if worth adding or should be through an option
            // It could also be an example in the docs about converters
            // $meta: {
            //   value: snapshot.metadata,
            // },
            // $ref: { get: () => snapshot.ref },
          }) as VueFirestoreDocumentData)
        : null
    },
  }

  globalDatabaseOptions.serialize = function createRecordFromDatabaseSnapshot(
    snapshot: DataSnapshot
  ): VueDatabaseDocumentData<unknown> {
    if (!snapshot.exists()) return null

    const value: unknown = snapshot.val()
    return isObject(value)
      ? (Object.defineProperty(value, 'id', {
          // allow destructuring without interfering without using the `id` property
          value: snapshot.key,
          enumerable: true,
        }) as VueDatabaseDocumentData<unknown>)
      : {
          // if the value is a primitive we can just return a regular object, it's easier to debug
          // @ts-expect-error: $value doesn't exist
          $value: value,
          id: snapshot.key,
        }
  }
})

export function isObject(o: unknown): o is Record<any, unknown> {
  return !!o && typeof o === 'object'
}
