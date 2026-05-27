'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import type { NewPlayer } from '@/lib/types'

interface AddPlayerDialogProps {
  open: boolean
  onClose: () => void
  onAdded: () => Promise<void>
  editingPlayer?: any
  addPlayer: (data: any) => Promise<any | null>
  updatePlayer?: (id: string, data: any) => Promise<void>
}

export function AddPlayerDialog({ open, onClose, onAdded, editingPlayer, addPlayer, updatePlayer }: AddPlayerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    position: '',
  })

  // Populate form when editing
  useEffect(() => {
    if (editingPlayer) {
      setFormData({
        name: editingPlayer.name || '',
        email: editingPlayer.email || '',
        phone: editingPlayer.phone || '',
        whatsapp: editingPlayer.whatsapp || '',
        position: editingPlayer.position || '',
      })
    }
  }, [editingPlayer])

  const isEditing = !!editingPlayer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const playerData: NewPlayer = {
      name: formData.name,
      email: formData.email || '',
      phone: formData.phone || '',
    }
    
    if (isEditing && updatePlayer) {
      await updatePlayer(editingPlayer.id, playerData)
    } else {
      await addPlayer(playerData)
    }
    
    onClose()
    await onAdded()
    setFormData({ name: '', email: '', phone: '', whatsapp: '', position: '' })
  }

  const handleCancel = () => {
    onClose()
    setFormData({ name: '', email: '', phone: '', whatsapp: '', position: '' })
  }

  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Player' : 'Add New Player'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Smith"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0123"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+1 555-0123"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Goalkeeper, Forward, etc."
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-red-500 hover:bg-red-600">
              {isEditing ? 'Update Player' : 'Add Player'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
