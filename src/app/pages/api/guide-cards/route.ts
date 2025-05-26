import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      title: 'Equipment',
      description: 'Card description for equipment.',
      image: '/images/equipment.jpg',
    },
    {
      id: 2,
      title: 'Emergency',
      description: 'Card description for emergency services.',
      image: '/images/emergency.jpg',
    },
    {
      id: 3,
      title: 'Patient Services',
      description: 'Card description for patient services.',
      image: '/images/patient.jpg',
    },
    {
      id: 4,
      title: 'Health Info',
      description: 'General health information card.',
      image: '/images/health.jpg',
    },
  ])
}
