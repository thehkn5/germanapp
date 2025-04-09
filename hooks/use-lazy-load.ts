"use client"

import { useState, useEffect } from "react"

export function useLazyLoad<T>(loader: () => Promise<T>, dependencies: any[] = []): [T | null, boolean, Error | null] {
  const [component, setComponent] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    loader()
      .then((comp) => {
