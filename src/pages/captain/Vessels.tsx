import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../app/providers/AuthProvider'

export default function Vessels() {
  const { user } = useAuth()
  const [vessels, setVessels] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('vessels')
      .select('*')
      .eq('owner_id', user.id)
      .then(({ data }) => setVessels(data || []))
  }, [user])

  const createVessel = async () => {
    await supabase.from('vessels').insert({
      owner_id: user.id,
      name: 'My Boat',
      length_meters: 10,
      width_meters: 3,
      draft_meters: 1,
      license_number: '123',
      registration_number: 'ABC'
    })
  }

  return (
    <div>
      <h1>My Vessels</h1>
      <button onClick={createVessel}>Add Vessel</button>
      {vessels.map(v => <div key={v.id}>{v.name}</div>)}
    </div>
  )
}