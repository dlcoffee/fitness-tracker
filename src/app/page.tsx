import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <main className="p-24">
      <Button>Log</Button>
      <Input type="email" placeholder="Email" />
    </main>
  )
}
