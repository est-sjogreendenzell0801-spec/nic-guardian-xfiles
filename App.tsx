import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { WeatherAlerts } from './components/weather-alerts'
import { EducationalContent } from './components/educational-content'
import { ReportEvent } from './components/report-event'
import { InteractiveMap } from './components/interactive-map'
import { Chatbox } from './components/chatbox'
import { Toaster } from './components/ui/sonner'
import { 
  AlertTriangle, 
  Map, 
  BookOpen, 
  Camera, 
  Shield, 
  Users,
  Bell,
  Activity
} from 'lucide-react'
import guardianNicaLogo from 'figma:asset/466017ebb6b33cb620a79333ee2e98e7d9fa311f.png'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const stats = [
    {
      label: 'Alertas Activas',
      value: '4',
      icon: AlertTriangle,
      color: 'text-red-500',
      description: 'En tu zona'
    },
    {
      label: 'Reportes Hoy',
      value: '12',
      icon: Camera,
      color: 'text-blue-500',
      description: 'Por usuarios'
    },
    {
      label: 'Usuarios Activos',
      value: '1,234',
      icon: Users,
      color: 'text-green-500',
      description: 'En línea'
    },
    {
      label: 'Área de Cobertura',
      value: '500km',
      icon: Shield,
      color: 'text-purple-500',
      description: 'Radio monitoreado'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1">
                <img 
                  src={guardianNicaLogo} 
                  alt="Guardian Nica Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Guardian Nica</h1>
                <p className="text-sm text-muted-foreground">
                  Sistema de Alerta Meteorológica
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Notificaciones
              </Button>
              <Badge variant="outline" className="gap-1">
                <Shield className="h-4 w-4" />
                En línea
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Educación
            </TabsTrigger>
            <TabsTrigger value="report" className="gap-2">
              <Camera className="h-4 w-4" />
              Reportar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Alertas del Dashboard */}
            <WeatherAlerts />

            {/* Resumen del día */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">15°C</div>
                    <p className="text-sm text-muted-foreground">Temperatura</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">65%</div>
                    <p className="text-sm text-muted-foreground">Humedad</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1013</div>
                    <p className="text-sm text-muted-foreground">Presión (hPa)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <InteractiveMap />
          </TabsContent>

          <TabsContent value="education">
            <EducationalContent />
          </TabsContent>

          <TabsContent value="report">
            <ReportEvent />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Información de la aplicación */}
            <div>
              <h3 className="font-medium mb-3">Guardian Nica</h3>
              <p className="text-sm text-muted-foreground">
                Sistema educativo de alertas meteorológicas para Nicaragua
              </p>
            </div>

            {/* Números de Emergencia Principales */}
            <div>
              <h3 className="font-medium mb-3">Emergencias Principales</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Policía Nacional:</span>
                  <span className="font-medium">118</span>
                </div>
                <div className="flex justify-between">
                  <span>Bomberos:</span>
                  <span className="font-medium">115</span>
                </div>
                <div className="flex justify-between">
                  <span>Central de Ambulancias:</span>
                  <span className="font-medium">102</span>
                </div>
                <div className="flex justify-between">
                  <span>Cruz Blanca:</span>
                  <span className="font-medium">128</span>
                </div>
              </div>
            </div>

            {/* Números Especializados */}
            <div>
              <h3 className="font-medium mb-3">Autoridades Especializadas</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>SINAPRED:</span>
                  <span className="font-medium">100</span>
                </div>
                <div className="flex justify-between">
                  <span>Defensa Civil:</span>
                  <span className="font-medium">2228-9915</span>
                </div>
                <div className="flex justify-between">
                  <span>ENACAL:</span>
                  <span className="font-medium">127</span>
                </div>
              </div>
            </div>
          </div>

          {/* Línea divisoria y copyright */}
          <div className="border-t pt-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 Guardian Nica. Sistema educativo de alertas meteorológicas
              </div>
              <div className="text-sm text-muted-foreground">
                🇳🇮 Protegiendo a Nicaragua
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbox de asistencia */}
      <Chatbox />

      <Toaster />
    </div>
  )
}
