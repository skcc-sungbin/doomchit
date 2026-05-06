import { createFileRoute } from '@tanstack/react-router'

import { Doomchit } from '@/features/doomchit/Doomchit'

export const Route = createFileRoute('/')({
  component: Doomchit,
})
