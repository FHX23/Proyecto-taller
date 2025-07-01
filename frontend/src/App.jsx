import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

function App() {
  const [email, setEmail] = useState("")

  const handleClearEmail = () => {
    setEmail("") 
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-6 rounded-2xl border shadow-xl">
        <h1 className="text-2xl font-bold text-center">Bienvenido</h1>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="modoOscuro">Modo oscuro</Label>
          <Switch id="modoOscuro" />
        </div>

        <Button className="w-full" onClick={handleClearEmail}>
          Ingresar
        </Button>
      </div>
    </main>
  )
}

export default App
