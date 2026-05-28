'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import type { NewGameData } from '@/lib/types'

export interface ScheduleGameDialogProps {
  open: boolean
  onClose: () => void
  onSubmitted: () => void
  editingGame?: any
  createGame: (data: NewGameData) => Promise<void>
  updateGame: (id: string, data: NewGameData) => Promise<void>
  groupId?: string | null
}

export function ScheduleGameDialog({ open, onClose, onSubmitted, editingGame, createGame, updateGame, groupId }: ScheduleGameDialogProps) {
  const [formData, setFormData] = useState({
    field: '',
    address: '',
    date: '',
    time: '',
    notes: '',
  })
  const [errors, setErrors] = useState<{date?: string; time?: string}>({})

  useEffect(() => {
    if (editingGame) {
      setFormData({
        field: editingGame.field_name || '',
        address: editingGame.full_address || '',
        date: editingGame.date || '',
        time: editingGame.time || '',
        notes: editingGame.notes || '',
      })
    } else {
      setFormData({ field: '', address: '', date: '', time: '', notes: '' })
    }
  }, [editingGame])

  const isEditing = !!editingGame

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: {date?: string; time?: string} = {}
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(formData.date)) {
      newErrors.date = 'Date must be YYYY-MM-DD (e.g., 2026-06-15)'
    }
    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(formData.time)) {
      newErrors.time = 'Time must be HH:MM (e.g., 14:30)'
    }
    if (newErrors.date || newErrors.time) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    const gameData: any = {
      league_id: groupId,
      field_name: formData.field,
      full_address: formData.address,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
    }

    if (isEditing) {
      await updateGame(editingGame.id, gameData)
    } else {
      await createGame(gameData)
    }

    setFormData({ field: '', address: '', date: '', time: '', notes: '' })
    onClose()
    onSubmitted()
  }

  const handleCancel = () => {
    setFormData({ field: '', address: '', date: '', time: '', notes: '' })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Game' : 'Schedule New Game'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="field">Field / Location *</Label>
            <Input
              id="field"
              placeholder="e.g., Jackson Field A"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                placeholder="YYYY-MM-DD"
                value={formData.date}
                onChange={(e) => { setFormData({ ...formData, date: e.target.value }); setErrors({}) }}
                required
                className={errors.date ? 'border-red-300' : ''}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                placeholder="HH:MM"
                value={formData.time}
                onChange={(e) => { setFormData({ ...formData, time: e.target.value }); setErrors({}) }}
                required
                className={errors.time ? 'border-red-300' : ''}
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Street, City"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Bring water, cleats, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600"
              disabled={!formData.field || !formData.date || !formData.time}
            >
              {isEditing ? 'Update Game' : 'Create Game'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
