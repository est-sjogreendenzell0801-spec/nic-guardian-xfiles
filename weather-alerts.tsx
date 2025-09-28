import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { MapPin, Clock, AlertTriangle, Info } from 'lucide-react'

interface WeatherAlert {
  id: string
  type: 'volcano' | 'storm' | 'flood' | 'wind' | 'fire' | 'earthquake' | 'hurricane' | 'landslide' | 'rockfall' | 'mudflow'
  severity: 'low' | 'medium' | 'high' | 'extreme'
  title: string
  description: string
  location: string
  coordinates: [number, number]
  distance: number
  timestamp: Date
  expires: Date
}

// Para simular cuando no hay alertas, cambiar esta variable a true
const NO_ALERTS_MODE = false

const mockAlerts: WeatherAlert[] = NO_ALERTS_MODE ? [] : [
  {
    id: '1',
    type: 'volcano',
    severity: 'extreme',
    title: 'Erupción Volcánica',
    description: 'Volcán Masaya presenta actividad elevada con emisión de gases y cenizas. Evite la zona de exclusión.',
    location: 'Volcán Masaya',
    coordinates: [11.9842, -86.1689],
    distance: 15.2,
    timestamp: new Date(),
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'storm',
    severity: 'high',
    title: 'Tormenta Eléctrica Severa',
    description: 'Lluvias intensas con actividad eléctrica peligrosa. Busque refugio en interiores.',
    location: 'Managua Centro',
    coordinates: [12.1364, -86.2514],
    distance: 5.7,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    expires: new Date(Date.now() + 4 * 60 * 60 * 1000)
  },
  {
    id: '3',
    type: 'earthquake',
    severity: 'medium',
    title: 'Actividad Sísmica',
    description: 'Serie de temblores detectados en la región. Manténgase alerta.',
    location: 'León',
    coordinates: [12.4334, -86.8780],
    distance: 8.3,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    expires: new Date(Date.now() + 6 * 60 * 60 * 1000)
  },
  {
    id: '4',
    type: 'landslide',
    severity: 'high',
    title: 'Riesgo de Deslaves',
    description: 'Lluvias intensas han saturado los suelos. Alto riesgo de deslaves en laderas y pendientes.',
    location: 'Catarina',
    coordinates: [11.9167, -86.0833],
    distance: 8.5,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    expires: new Date(Date.now() + 12 * 60 * 60 * 1000)
  },
  {
    id: '5',
    type: 'rockfall',
    severity: 'medium',
    title: 'Riesgo de Derrumbes',
    description: 'Actividad sísmica reciente puede provocar desprendimientos rocosos en acantilados.',
    location: 'Mirador de Catarina',
    coordinates: [11.9200, -86.0800],
    distance: 9.2,
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000)
  }
]

const severityColors = {
  low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  medium: 'bg-orange-100 text-orange-800 border-orange-200',
  high: 'bg-red-100 text-red-800 border-red-200',
  extreme: 'bg-purple-100 text-purple-800 border-purple-200'
}

const severityLabels = {
  low: 'BAJO',
  medium: 'MEDIO',
  high: 'ALTO',
  extreme: 'EXTREMO'
}

const typeIcons = {
  volcano: '🌋',
  storm: '⚡',
  flood: '🌊',
  wind: '🌪️',
  fire: '🔥',
  earthquake: '🌍',
  hurricane: '🌀',
  landslide: '🏔️',
  rockfall: '🪨',
  mudflow: '🌊'
}

const typeNames = {
  volcano: 'Volcán',
  storm: 'Tormenta',
  flood: 'Inundación',
  wind: 'Viento',
  fire: 'Incendio',
  earthquake: 'Temblor',
  hurricane: 'Huracán',
  landslide: 'Deslaves',
  rockfall: 'Derrumbes',
  mudflow: 'Flujo de Lodo'
}

export function WeatherAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    // Simular obtención de geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {
          // Ubicación por defecto (Buenos Aires)
          setUserLocation([-34.6037, -58.3816])
        }
      )
    } else {
      setUserLocation([-34.6037, -58.3816])
    }

    // Simular alertas basadas en ubicación
    setAlerts(mockAlerts)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatTimeRemaining = (expires: Date) => {
    const diff = expires.getTime() - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h2>Alertas Activas en tu Zona</h2>
        {userLocation && (
          <Badge variant="outline" className="ml-auto">
            <MapPin className="h-3 w-3 mr-1" />
            Ubicación detectada
          </Badge>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Ninguna actividad reciente</h3>
            <p className="text-sm text-muted-foreground">
              No hay alertas meteorológicas activas en tu zona en este momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeIcons[alert.type]}</span>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {typeNames[alert.type]}
                    </Badge>
                  </div>
                  <Badge className={severityColors[alert.severity]}>
                    {severityLabels[alert.severity]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{alert.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {alert.location} ({alert.distance} km)
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Emitida: {formatTime(alert.timestamp)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Expira en: {formatTimeRemaining(alert.expires)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}