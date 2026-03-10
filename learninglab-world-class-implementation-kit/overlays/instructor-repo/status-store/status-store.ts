import fs from 'node:fs/promises'
import path from 'node:path'

export type StatusStore = {
  listId: string
  listPath: string
  allocationPath: string
  buffer: Buffer
  bitstringLength: number
  allocations: {
    nextIndex: number
    issued: Record<string, number>
  }
}

export async function loadStatusStore({
  listId,
  listPath,
  bitstringLength = 8192
}: {
  listId: string
  listPath: string
  bitstringLength?: number
}): Promise<StatusStore> {
  await fs.mkdir(path.dirname(listPath), { recursive: true })

  const listPayload = await loadOrCreateList(listPath, bitstringLength)
  const allocationPath = listPath.replace(/\.json$/, '.allocations.json')
  const allocations = await loadOrCreateAllocations(allocationPath)

  return {
    listId,
    listPath,
    allocationPath,
    buffer: Buffer.from(listPayload.encodedList, 'base64'),
    bitstringLength: Number(listPayload.bitstringLength || bitstringLength),
    allocations
  }
}

export async function allocateStatusIndex(store: StatusStore, credentialId: string): Promise<number> {
  if (!credentialId) throw new Error('credential_id_required')

  const existing = store.allocations.issued[credentialId]
  if (typeof existing === 'number') {
    return existing
  }

  const index = Number(store.allocations.nextIndex || 0)
  if (index >= store.bitstringLength) {
    throw new Error('status_list_full')
  }

  store.allocations.issued[credentialId] = index
  store.allocations.nextIndex = index + 1
  await persistAllocations(store)

  return index
}

export async function setStatusBit(store: StatusStore, index: number, revoked: boolean) {
  const byteIndex = Math.floor(index / 8)
  const bitOffset = index % 8
  const mask = 1 << bitOffset

  if (byteIndex >= store.buffer.length) {
    throw new Error('status_index_out_of_range')
  }

  const current = (store.buffer[byteIndex] & mask) > 0
  if (current === revoked) return

  if (revoked) {
    store.buffer[byteIndex] |= mask
  } else {
    store.buffer[byteIndex] &= ~mask
  }

  await persistList(store)
}

async function loadOrCreateList(listPath: string, bitstringLength: number) {
  try {
    const raw = await fs.readFile(listPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    const bytesLen = Math.ceil(bitstringLength / 8)
    const payload = {
      statusPurpose: 'revocation',
      bitstringLength,
      encodedList: Buffer.alloc(bytesLen).toString('base64')
    }
    await fs.writeFile(listPath, JSON.stringify(payload, null, 2))
    return payload
  }
}

async function loadOrCreateAllocations(allocationPath: string) {
  try {
    const raw = await fs.readFile(allocationPath, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      nextIndex: Number(parsed.nextIndex || 0),
      issued: parsed.issued || {}
    }
  } catch {
    const initial = {
      nextIndex: 0,
      issued: {}
    }
    await fs.writeFile(allocationPath, JSON.stringify(initial, null, 2))
    return initial
  }
}

async function persistList(store: StatusStore) {
  const payload = {
    statusPurpose: 'revocation',
    bitstringLength: store.bitstringLength,
    encodedList: store.buffer.toString('base64')
  }
  await fs.writeFile(store.listPath, JSON.stringify(payload, null, 2))
}

async function persistAllocations(store: StatusStore) {
  const payload = {
    nextIndex: store.allocations.nextIndex,
    issued: store.allocations.issued
  }
  await fs.writeFile(store.allocationPath, JSON.stringify(payload, null, 2))
}
