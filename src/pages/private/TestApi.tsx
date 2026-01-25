import { useEffect } from 'react'
import { api } from '../../services/api'

export default function TestApi() {
  useEffect(() => {
    api.get('/sucursales')
      .then(res => console.log(res.data))
      .catch(err => console.error(err))
  }, [])

  return <h3>Revisa la consola</h3>
}
