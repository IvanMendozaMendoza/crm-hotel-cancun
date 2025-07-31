"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  className?: string
}

export const ColorPicker = ({ value = "#3b82f6", onChange, className }: ColorPickerProps) => {
  const [internalHue, setInternalHue] = useState(210)
  const [internalSaturation, setInternalSaturation] = useState(100)
  const [internalLightness, setInternalLightness] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const lastValueRef = useRef(value)

  // Convert hex to HSL
  const hexToHsl = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }, [])

  // Convert HSL to hex
  const hslToHex = useCallback((h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = l - c / 2
    let r = 0
    let g = 0
    let b = 0

    if (0 <= h && h < 1) {
      r = c
      g = x
      b = 0
    } else if (1 <= h && h < 2) {
      r = x
      g = c
      b = 0
    } else if (2 <= h && h < 3) {
      r = 0
      g = c
      b = x
    } else if (3 <= h && h < 4) {
      r = 0
      g = x
      b = c
    } else if (4 <= h && h < 5) {
      r = x
      g = 0
      b = c
    } else if (5 <= h && h < 6) {
      r = c
      g = 0
      b = x
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
  }, [])

  // Update internal state when external value changes
  useEffect(() => {
    if (value !== lastValueRef.current && value && value.startsWith('#')) {
      lastValueRef.current = value
      const hsl = hexToHsl(value)
      setInternalHue(hsl.h)
      setInternalSaturation(hsl.s)
      setInternalLightness(hsl.l)
    }
  }, [value, hexToHsl])

  // Update external value when internal state changes
  const updateExternalValue = useCallback((h: number, s: number, l: number) => {
    const hex = hslToHex(h, s, l)
    if (hex !== lastValueRef.current && onChange) {
      lastValueRef.current = hex
      onChange(hex)
    }
  }, [hslToHex, onChange])

  const handleHueChange = useCallback((newHue: number) => {
    setInternalHue(newHue)
    updateExternalValue(newHue, internalSaturation, internalLightness)
  }, [internalSaturation, internalLightness, updateExternalValue])

  const handleSaturationLightnessChange = useCallback((newSaturation: number, newLightness: number) => {
    setInternalSaturation(newSaturation)
    setInternalLightness(newLightness)
    updateExternalValue(internalHue, newSaturation, newLightness)
  }, [internalHue, updateExternalValue])

  const handlePickerMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    handlePickerMouseMove(e)
  }, [])

  const handlePickerMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !pickerRef.current) return

    const rect = pickerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

    const newSaturation = Math.round(x * 100)
    const newLightness = Math.round((1 - y) * 100)
    handleSaturationLightnessChange(newSaturation, newLightness)
  }, [isDragging, handleSaturationLightnessChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handlePickerMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handlePickerMouseMove as any)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handlePickerMouseMove, handleMouseUp])

  const currentColor = hslToHex(internalHue, internalSaturation, internalLightness)
  const pickerBackground = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${internalHue}, 100%, 50%))`

  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    if (hex.match(/^#[0-9A-Fa-f]{6}$/) && hex !== lastValueRef.current) {
      lastValueRef.current = hex
      const hsl = hexToHsl(hex)
      setInternalHue(hsl.h)
      setInternalSaturation(hsl.s)
      setInternalLightness(hsl.l)
      if (onChange) {
        onChange(hex)
      }
    }
  }, [hexToHsl, onChange])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Color Selection Area */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Color</Label>
        <div
          ref={pickerRef}
          className="relative w-full h-32 rounded-lg border border-gray-600 cursor-crosshair"
          style={{ background: pickerBackground }}
          onMouseDown={handlePickerMouseDown}
        >
          <div
            className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none"
            style={{
              left: `${internalSaturation}%`,
              top: `${100 - internalLightness}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      {/* Hue Slider */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Hue</Label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="360"
            value={internalHue}
            onChange={(e) => handleHueChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-magenta-500 to-red-500 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), 
                hsl(240, 100%, 50%), 
                hsl(300, 100%, 50%), 
                hsl(360, 100%, 50%)
              )`
            }}
          />
          <div
            className="absolute top-0 w-3 h-2 bg-white border border-gray-300 rounded pointer-events-none"
            style={{
              left: `${(internalHue / 360) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
      </div>

      {/* Hex Input */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">HEX</Label>
        <div className="flex items-center gap-2">
          <Input
            value={currentColor.toUpperCase()}
            onChange={handleHexInputChange}
            className="flex-1 bg-gray-800 border-gray-600 text-white font-mono text-sm"
            placeholder="#3b82f6"
          />
          <div
            className="w-8 h-8 rounded border border-gray-600"
            style={{ backgroundColor: currentColor }}
          />
        </div>
      </div>
    </div>
  )
} 