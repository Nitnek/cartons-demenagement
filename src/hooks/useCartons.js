import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'cartons-demenagement'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(cartons) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartons))
}

export function useCartons() {
  const [cartons, setCartons] = useState(load)

  useEffect(() => {
    save(cartons)
  }, [cartons])

  const nextNumber = useCallback((prefix, list) => {
    const nums = list
      .filter(c => c.prefix === prefix)
      .map(c => c.number)
    return nums.length ? Math.max(...nums) + 1 : 1
  }, [])

  const addCarton = useCallback((data) => {
    setCartons(prev => {
      const number = data.number ?? nextNumber(data.prefix, prev)
      return [...prev, { id: uuidv4(), ...data, number }]
    })
  }, [nextNumber])

  const updateCarton = useCallback((id, data) => {
    setCartons(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }, [])

  const deleteCarton = useCallback((id) => {
    setCartons(prev => prev.filter(c => c.id !== id))
  }, [])

  const cycleStatus = useCallback((id) => {
    const order = ['à emballer', 'emballé', 'déballé']
    setCartons(prev => prev.map(c => {
      if (c.id !== id) return c
      const idx = order.indexOf(c.status)
      return { ...c, status: order[(idx + 1) % order.length] }
    }))
  }, [])

  return { cartons, addCarton, updateCarton, deleteCarton, cycleStatus, nextNumber }
}
