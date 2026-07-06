import { getPool } from './db'

function escapeIdent(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}

function escapeVal(val: any, idx: number): string {
  if (val === null || val === undefined) return 'NULL'
  return `$${idx}`
}

function buildConditions(conds: { col: string; op: string; val: any }[]): { clause: string; params: any[] } {
  const parts: string[] = []
  const params: any[] = []
  for (const c of conds) {
    const idx = params.length + 1
    if (c.op === 'eq') { parts.push(`${escapeIdent(c.col)} = $${idx}`); params.push(c.val) }
    else if (c.op === 'neq') { parts.push(`${escapeIdent(c.col)} != $${idx}`); params.push(c.val) }
    else if (c.op === 'gte') { parts.push(`${escapeIdent(c.col)} >= $${idx}`); params.push(c.val) }
    else if (c.op === 'lte') { parts.push(`${escapeIdent(c.col)} <= $${idx}`); params.push(c.val) }
    else if (c.op === 'gt') { parts.push(`${escapeIdent(c.col)} > $${idx}`); params.push(c.val) }
    else if (c.op === 'lt') { parts.push(`${escapeIdent(c.col)} < $${idx}`); params.push(c.val) }
    else if (c.op === 'like') { parts.push(`${escapeIdent(c.col)} LIKE $${idx}`); params.push(c.val) }
    else if (c.op === 'in') {
      const placeholders = c.val.map((_: any, i: number) => `$${idx + i}`).join(', ')
      parts.push(`${escapeIdent(c.col)} IN (${placeholders})`)
      params.push(...c.val)
    }
  }
  return { clause: parts.length ? parts.join(' AND ') : '', params }
}

type Row = Record<string, any>

function snakeToCamel(obj: Row): Row {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj
  const result: Row = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.replace(/_([a-z])/g, (_, l) => l.toUpperCase()), v])
  )
  if ('title' in obj && !('name' in result)) {
    result.name = obj.title
  }
  return result
}

function camelToSnake(obj: Row): Row {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`), v])
  )
}

function selectBuilder(table: string, columns: string) {
  const conds: { col: string; op: string; val: any }[] = []
  let orClause = ''
  let orderCol = ''
  let orderDir = 'ASC'
  let limitVal = 0
  let colStr = columns === '*' ? '*' : columns.split(',').map(c => escapeIdent(c.trim())).join(', ')

  function buildWhere(includeOr: boolean): { clause: string; params: any[] } {
    const { clause, params } = buildConditions(conds)
    const parts: string[] = []
    if (clause) parts.push(clause)
    if (includeOr && orClause) parts.push(orClause)
    return { clause: parts.length ? parts.join(' AND ') : '', params }
  }

  const q = {
    eq: (col: string, val: any) => { conds.push({ col, op: 'eq', val }); return q },
    neq: (col: string, val: any) => { conds.push({ col, op: 'neq', val }); return q },
    gte: (col: string, val: any) => { conds.push({ col, op: 'gte', val }); return q },
    lte: (col: string, val: any) => { conds.push({ col, op: 'lte', val }); return q },
    gt: (col: string, val: any) => { conds.push({ col, op: 'gt', val }); return q },
    lt: (col: string, val: any) => { conds.push({ col, op: 'lt', val }); return q },
    like: (col: string, val: any) => { conds.push({ col, op: 'like', val }); return q },
    in: (col: string, val: any[]) => { conds.push({ col, op: 'in', val }); return q },
    order: (col: string, opts?: { ascending?: boolean }) => { orderCol = col; orderDir = opts?.ascending === false ? 'DESC' : 'ASC'; return q },
    limit: (n: number) => { limitVal = n; return q },
    or: (filters: string) => {
      const parts = filters.split(',').map((f: string) => {
        const m = f.match(/^(\w+)\.(\w+)\.(.+)$/)
        if (!m) return ''
        const col = escapeIdent(m[1])
        const sqlOp = m[2] === 'eq' ? '=' : m[2] === 'neq' ? '!=' : m[2] === 'gt' ? '>' : m[2] === 'lt' ? '<' : m[2] === 'gte' ? '>=' : m[2] === 'lte' ? '<=' : '='
        let val = m[3]
        val = `'${val.replace(/'/g, "''")}'`
        return `${col} ${sqlOp} ${val}`
      }).filter(Boolean).join(' OR ')
      if (parts) orClause = `(${parts})`
      return q
    },
    maybeSingle: async () => {
      const pool = getPool()
      if (!pool) return { data: null, error: null }
      const { clause, params } = buildWhere(true)
      const where = clause ? ` WHERE ${clause}` : ''
      const order = orderCol ? ` ORDER BY ${escapeIdent(orderCol)} ${orderDir}` : ''
      try {
        const text = `SELECT ${colStr} FROM ${escapeIdent(table)}${where}${order} LIMIT 1`
        const { rows } = await pool.query(text, params)
        return { data: rows[0] ? snakeToCamel(rows[0]) : null, error: null }
      } catch (e: any) {
        return { data: null, error: e }
      }
    },
    single: async () => {
      const pool = getPool()
      if (!pool) return { data: null, error: null }
      const { clause, params } = buildWhere(true)
      const where = clause ? ` WHERE ${clause}` : ''
      try {
        const text = `SELECT ${colStr} FROM ${escapeIdent(table)}${where} LIMIT 1`
        const { rows } = await pool.query(text, params)
        return { data: rows[0] ? snakeToCamel(rows[0]) : null, error: rows.length === 0 ? new Error('Not found') : null }
      } catch (e: any) {
        return { data: null, error: e }
      }
    },
    then: async (resolve: Function) => {
      const pool = getPool()
      if (!pool) return resolve({ data: [], error: null })
      const { clause, params } = buildWhere(true)
      const where = clause ? ` WHERE ${clause}` : ''
      const order = orderCol ? ` ORDER BY ${escapeIdent(orderCol)} ${orderDir}` : ''
      const limit = limitVal ? ` LIMIT ${limitVal}` : ''
      try {
        const text = `SELECT ${colStr} FROM ${escapeIdent(table)}${where}${order}${limit}`
        const { rows } = await pool.query(text, params)
        resolve({ data: rows.map((r: Row) => snakeToCamel(r)), error: null })
      } catch (e: any) {
        resolve({ data: [], error: e })
      }
    },
  }
  return q
}

function insertBuilder(table: string, obj: Row) {
  const snaked = camelToSnake(obj)
  const cols = Object.keys(snaked)
  const vals = Object.values(snaked)
  const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ')
  const colNames = cols.map(c => escapeIdent(c)).join(', ')

  return {
    select: () => ({
      single: async () => {
        const pool = getPool()
        if (!pool) return { data: null, error: null }
        try {
          const text = `INSERT INTO ${escapeIdent(table)} (${colNames}) VALUES (${placeholders}) RETURNING *`
          const { rows } = await pool.query(text, vals)
          return { data: rows[0] ? snakeToCamel(rows[0]) : null, error: null }
        } catch (e: any) {
          return { data: null, error: e }
        }
      },
    }),
    then: async (resolve: Function) => {
      const pool = getPool()
      if (!pool) { resolve({ data: null, error: null }); return }
      try {
        const text = `INSERT INTO ${escapeIdent(table)} (${colNames}) VALUES (${placeholders})`
        await pool.query(text, vals)
        resolve({ data: null, error: null })
      } catch (e: any) {
        resolve({ data: null, error: e })
      }
    },
  }
}

function updateBuilder(table: string, obj: Row) {
  const snaked = camelToSnake(obj)
  const entries = Object.entries(snaked).filter(([k]) => k !== 'id')
  const setClause = entries.map(([k], i) => `${escapeIdent(k)} = $${i + 1}`).join(', ')
  const vals = entries.map(([_, v]) => v)

  return {
    eq: (col: string, val: any) => {
      const idx = vals.length + 1
      return {
        select: () => ({
          single: async () => {
            const pool = getPool()
            if (!pool) return { data: null, error: null }
            try {
              const text = `UPDATE ${escapeIdent(table)} SET ${setClause} WHERE ${escapeIdent(col)} = $${idx} RETURNING *`
              const { rows } = await pool.query(text, [...vals, val])
              return { data: rows[0] ? snakeToCamel(rows[0]) : null, error: null }
            } catch (e: any) {
              return { data: null, error: e }
            }
          },
        }),
        then: async (resolve: Function) => {
          const pool = getPool()
          if (!pool) { resolve({ data: null, error: null }); return }
          try {
            const text = `UPDATE ${escapeIdent(table)} SET ${setClause} WHERE ${escapeIdent(col)} = $${idx}`
            await pool.query(text, [...vals, val])
            resolve({ data: null, error: null })
          } catch (e: any) {
            resolve({ data: null, error: e })
          }
        },
      }
    },
  }
}

function deleteBuilder(table: string) {
  return {
    eq: async (col: string, val: any) => {
      const pool = getPool()
      if (!pool) return { data: null, error: null }
      try {
        const text = `DELETE FROM ${escapeIdent(table)} WHERE ${escapeIdent(col)} = $1`
        await pool.query(text, [val])
        return { data: null, error: null }
      } catch (e: any) {
        return { data: null, error: e }
      }
    },
  }
}

function buildMock() {
  const query = (result: any = null): any =>
    new Proxy(() => {}, {
      get(_t, p) {
        if (p === 'then') return (resolve: Function) => resolve({ data: result, error: null })
        if (p === 'catch') return (_reject: Function) => {}
        if (p === 'finally') return (cb: Function) => { cb(); return query(result) }
        if (p === 'single' || p === 'maybeSingle') return query(Array.isArray(result) ? (result[0] ?? null) : result)
        return query(result)
      },
      apply() { return query(result) },
    })
  return new Proxy({} as any, {
    get(_t, prop) {
      if (prop === 'from') return () => query([])
      if (typeof prop === 'string') return () => query(null)
      return undefined
    },
  })
}

const pool = getPool()
export const supabase: any = pool ? {
  from: (table: string) => ({
    select: (columns: string = '*') => selectBuilder(table, columns),
    insert: (obj: Row) => insertBuilder(table, obj),
    update: (obj: Row) => updateBuilder(table, obj),
    delete: () => deleteBuilder(table),
    upsert: (obj: Row, opts?: { onConflict?: string }) => {
      const snaked = camelToSnake(obj)
      const cols = Object.keys(snaked)
      const vals = Object.values(snaked)
      const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ')
      const colNames = cols.map(c => escapeIdent(c)).join(', ')
      const conflictCol = opts?.onConflict ? escapeIdent(opts.onConflict) : escapeIdent(cols[0])
      const updateSet = cols.map(c => `${escapeIdent(c)} = EXCLUDED.${escapeIdent(c)}`).join(', ')
      return {
        then: async (resolve: Function) => {
          const p = getPool()
          if (!p) { resolve({ data: null, error: null }); return }
          try {
            const text = `INSERT INTO ${escapeIdent(table)} (${colNames}) VALUES (${placeholders}) ON CONFLICT (${conflictCol}) DO UPDATE SET ${updateSet}`
            await p.query(text, vals)
            resolve({ data: null, error: null })
          } catch (e: any) {
            resolve({ data: null, error: e })
          }
        },
      }
    },
  }),
} : buildMock()
