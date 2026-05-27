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
    name: '',
    date: '',
    time: '',
    field: '',
    address: '',
    notes: '',
  })

  // Populate form when editing
  useEffect(() => {
    if (editingGame) {
      setFormData({
        name: editingGame.field_name || '',
        date: editingGame.date || '',
        time: editingGame.time || '',
        field: editingGame.field_name || '',
        address: editingGame.full_address || '',
        notes: editingGame.notes || '',
      })
    } else {
      setFormData({
        name: '',
        date: '',
        time: '',
        field: '',
        address: '',
        notes: '',
      })
    }
  }, [editingGame])

  const isEditing = !!editingGame

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    
    setFormData({
      name: '',
      date: '',
      time: '',
      field: '',
      address: '',
      notes: '',
    })
    onClose()
    onSubmitted()
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      field: '',
      address: '',
      notes: '',
    })
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
            <Label htmlFor="game-name">Game Name</Label>
            <Input
              id="game-name"
              placeholder="e.g., Weekend Group"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="field">Field Name</Label>
            <Input
              id="field"
              placeholder="e.g., Jackson Field A"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            />
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
              disabled={!formData.date || !formData.time}
            >
              {isEditing ? 'Update Game' : 'Create Game'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
