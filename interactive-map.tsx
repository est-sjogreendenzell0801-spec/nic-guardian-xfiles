import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { MapPin, Layers, Zap, Eye, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface MapEvent {
  id: string
  type: 'volcano' | 'storm' | 'flood' | 'wind' | 'fire' | 'earthquake' | 'hurricane' | 'landslide' | 'rockfall' | 'mudflow'
  coordinates: [number, number]
  severity: 'low' | 'medium' | 'high' | 'extreme'
  title: string
  description: string
  timestamp: Date
  radius: number // en km
}

interface MasayaZone {
  id: string
  name: string
  coordinates: { x: number; y: number }
  reports: ReportedEvent[]
}

interface ReportedEvent {
  id: string
  type: 'volcano' | 'storm' | 'flood' | 'wind' | 'fire' | 'earthquake' | 'hurricane' | 'landslide' | 'rockfall' | 'mudflow'
  timestamp: Date
  reporter: string
}

interface DisasterType {
  id: string
  emoji: string
  name: string
  description: string
}

// Zonas de Masaya para el mapa interactivo basadas en ubicaciones reales
const masayaZones: MasayaZone[] = [
  {
    id: 'centro_masaya',
    name: 'Centro Masaya',
    coordinates: { x: 35, y: 45 },
    reports: [
      {
        id: '1',
        type: 'volcano',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        reporter: 'Observador Local'
      }
    ]
  },
  {
    id: 'volcan_masaya',
    name: 'Parque Nacional Volcán Masaya',
    coordinates: { x: 60, y: 30 },
    reports: [
      {
        id: '2',
        type: 'volcano',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        reporter: 'INETER'
      },
      {
        id: '3',
        type: 'earthquake',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        reporter: 'Sismólogo'
      }
    ]
  },
  {
    id: 'laguna_masaya',
    name: 'Laguna de Masaya',
    coordinates: { x: 50, y: 65 },
    reports: []
  },
  {
    id: 'nindiri',
    name: 'Nindirí',
    coordinates: { x: 20, y: 60 },
    reports: [
      {
        id: '4',
        type: 'storm',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        reporter: 'Residente'
      }
    ]
  },
  {
    id: 'monimbo',
    name: 'Barrio Monimbó',
    coordinates: { x: 32, y: 55 },
    reports: []
  },
  {
    id: 'san_marcos',
    name: 'San Marcos',
    coordinates: { x: 25, y: 35 },
    reports: []
  },
  {
    id: 'catarina',
    name: 'Catarina',
    coordinates: { x: 45, y: 75 },
    reports: [
      {
        id: '5',
        type: 'landslide',
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        reporter: 'SINAPRED'
      }
    ]
  },
  {
    id: 'san_juan_oriente',
    name: 'San Juan de Oriente',
    coordinates: { x: 55, y: 70 },
    reports: []
  },
  {
    id: 'la_concepcion',
    name: 'La Concepción',
    coordinates: { x: 70, y: 50 },
    reports: []
  },
  {
    id: 'tisma',
    name: 'Tisma',
    coordinates: { x: 15, y: 25 },
    reports: []
  }
]

// Tipos de desastres disponibles para reportar
const disasterTypes: DisasterType[] = [
  { id: 'volcano', emoji: '🌋', name: 'Volcán', description: 'Volcán / erupción' },
  { id: 'storm', emoji: '⚡', name: 'Tormenta', description: 'Tormenta eléctrica / Lluvia fuerte' },
  { id: 'flood', emoji: '🌊', name: 'Inundación', description: 'Inundación / Agua alta' },
  { id: 'wind', emoji: '🌪️', name: 'Viento', description: 'Viento fuerte / Tornado' },
  { id: 'fire', emoji: '🔥', name: 'Incendio', description: 'Incendio / Fuego' },
  { id: 'earthquake', emoji: '🌍', name: 'Temblor', description: 'Temblor / Sismo' },
  { id: 'hurricane', emoji: '🌀', name: 'Huracán', description: 'Huracán / Ciclón' },
  { id: 'landslide', emoji: '🏔️', name: 'Deslaves', description: 'Deslizamiento de tierra / Deslaves' },
  { id: 'rockfall', emoji: '🪨', name: 'Derrumbes', description: 'Derrumbe de rocas / Desprendimientos' },
  { id: 'mudflow', emoji: '🌊', name: 'Flujo de Lodo', description: 'Flujo de lodo / Avalancha de lodo' }
]

const eventColors = {
  volcano: 'bg-red-600',
  storm: 'bg-yellow-500',
  flood: 'bg-blue-500',
  wind: 'bg-gray-500',
  fire: 'bg-orange-500',
  earthquake: 'bg-purple-600',
  hurricane: 'bg-purple-500',
  landslide: 'bg-green-600',
  rockfall: 'bg-stone-600',
  mudflow: 'bg-amber-600'
}

const eventIcons = {
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

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  extreme: 'bg-red-100 text-red-800'
}

export function InteractiveMap() {
  const [zones, setZones] = useState<MasayaZone[]>(masayaZones)
  const [selectedZone, setSelectedZone] = useState<MasayaZone | null>(null)
  const [selectedDisasterType, setSelectedDisasterType] = useState<DisasterType | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [pendingReport, setPendingReport] = useState<{zone: MasayaZone, disasterType: DisasterType} | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isConfirming && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (isConfirming && countdown === 0) {
      // Auto confirmar después de 5 segundos
      handleConfirmReport()
    }

    return () => clearInterval(interval)
  }, [isConfirming, countdown])

  const handleZoneClick = (zone: MasayaZone) => {
    if (selectedDisasterType) {
      // Iniciar proceso de confirmación
      setPendingReport({ zone, disasterType: selectedDisasterType })
      setIsConfirming(true)
      setCountdown(5)
      toast(`Reportando ${selectedDisasterType.name} en ${zone.name}`)
    } else {
      setSelectedZone(zone)
      toast('Primero selecciona un tipo de evento en la barra inferior')
    }
  }

  const handleDisasterSelect = (disasterType: DisasterType) => {
    setSelectedDisasterType(disasterType)
    toast(`${disasterType.emoji} ${disasterType.name} seleccionado`)
  }

  const handleConfirmReport = () => {
    if (pendingReport) {
      const newReport: ReportedEvent = {
        id: Date.now().toString(),
        type: pendingReport.disasterType.id as any,
        timestamp: new Date(),
        reporter: 'Usuario'
      }

      setZones(prevZones => 
        prevZones.map(zone => 
          zone.id === pendingReport.zone.id 
            ? { ...zone, reports: [...zone.reports, newReport] }
            : zone
        )
      )

      toast.success(`✅ Reporte confirmado: ${pendingReport.disasterType.name} en ${pendingReport.zone.name}`)
    }

    // Resetear estado
    setIsConfirming(false)
    setCountdown(5)
    setPendingReport(null)
    setSelectedDisasterType(null)
  }

  const handleCancelReport = () => {
    setIsConfirming(false)
    setCountdown(5)
    setPendingReport(null)
    toast('Reporte cancelado')
  }

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `hace ${hours}h`
    }
    return `hace ${minutes}min`
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2>Mapa de Masaya - Reporte de Desastres</h2>
          <p className="text-muted-foreground">
            Haz clic en una zona y selecciona un emoji para reportar eventos
          </p>
        </div>
        
        <Badge variant="outline" className="gap-2">
          <MapPin className="h-3 w-3" />
          Masaya, Nicaragua
        </Badge>
      </div>

      {/* Overlay de confirmación */}
      {isConfirming && pendingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-80 border-2 border-orange-500 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Confirmar Reporte</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-lg">
                {pendingReport.disasterType.emoji} {pendingReport.disasterType.name}
              </div>
              <div className="text-sm text-muted-foreground">
                en <strong>{pendingReport.zone.name}</strong>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {countdown > 0 ? countdown : 'Confirmando...'}
              </div>
              <p className="text-sm text-muted-foreground">
                {countdown > 0 ? 'Espera para confirmar tu reporte' : 'Reporte confirmado'}
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleConfirmReport}
                  className="flex-1 gap-2"
                  disabled={countdown > 0}
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirmar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelReport}
                  disabled={countdown === 0}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mapa principal de Masaya */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Masaya
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Haz clic en una zona para reportar eventos. {selectedDisasterType ? `Tipo seleccionado: ${selectedDisasterType.emoji} ${selectedDisasterType.name}` : 'Selecciona un tipo de evento abajo'}
          </p>
        </CardHeader>
        <CardContent>
          {/* Mapa de Masaya con zonas clicables */}
          <div 
            className="relative w-full h-[500px] bg-gradient-to-br from-green-100 via-green-200 to-green-300 rounded-lg border-2 border-gray-300 overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 60% 30%, rgba(220, 38, 38, 0.3) 0%, transparent 20%),
                radial-gradient(circle at 50% 65%, rgba(59, 130, 246, 0.4) 0%, transparent 15%),
                linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 25%, #86efac 50%, #4ade80 75%, #22c55e 100%)
              `
            }}
          >
            {/* Elementos geográficos */}
            <div className="absolute inset-0">
              {/* Volcán Masaya - Cráter principal */}
              <div className="absolute top-[28%] left-[58%] w-8 h-8 bg-red-600 rounded-full shadow-lg border-2 border-red-800 flex items-center justify-center">
                <span className="text-white text-xs">🌋</span>
              </div>
              
              {/* Laguna de Masaya */}
              <div className="absolute top-[63%] left-[48%] w-12 h-8 bg-blue-400 rounded-full opacity-80 shadow-inner"></div>
              
              {/* Laguna de Apoyo (cercana) */}
              <div className="absolute top-[73%] left-[43%] w-8 h-6 bg-blue-500 rounded-full opacity-70"></div>
              
              {/* Carreteras principales */}
              <div className="absolute top-[40%] left-[15%] w-[70%] h-0.5 bg-gray-400 transform rotate-12 opacity-60"></div>
              <div className="absolute top-[50%] left-[20%] w-[60%] h-0.5 bg-gray-400 transform -rotate-6 opacity-60"></div>
            </div>

            {/* Título del mapa */}
            <div className="absolute top-3 left-3 bg-white/95 px-4 py-2 rounded-lg text-sm font-medium shadow-md">
              🇳🇮 Departamento de Masaya
            </div>

            {/* Escala */}
            <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-black"></div>
                <span>5 km</span>
              </div>
            </div>

            {/* Rosa de los vientos */}
            <div className="absolute top-3 right-3 bg-white/95 p-2 rounded-full text-xs shadow-md">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">N</div>
                <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-black transform -translate-x-1/2"></div>
              </div>
            </div>

            {/* Zonas clicables */}
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${
                  selectedZone?.id === zone.id ? 'scale-110 z-20' : ''
                } ${selectedDisasterType ? 'hover:scale-105' : ''}`}
                style={{
                  left: `${zone.coordinates.x}%`,
                  top: `${zone.coordinates.y}%`
                }}
                onClick={() => handleZoneClick(zone)}
                title={zone.name}
              >
                {/* Zona base */}
                <div className={`w-20 h-14 rounded-xl border-2 border-white shadow-lg flex flex-col items-center justify-center text-xs text-center p-1 ${
                  selectedZone?.id === zone.id 
                    ? 'bg-blue-600 text-white border-blue-300' 
                    : selectedDisasterType 
                      ? 'bg-white/90 text-blue-900 hover:bg-blue-50' 
                      : 'bg-white/85 text-gray-700'
                }`}>
                  <div className="text-[9px] leading-tight mb-1 px-1">{zone.name}</div>
                  
                  {/* Reportes en la zona */}
                  {zone.reports.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {zone.reports.slice(0, 3).map((report, index) => (
                        <span key={report.id} className="text-[10px]">
                          {disasterTypes.find(d => d.id === report.type)?.emoji}
                        </span>
                      ))}
                      {zone.reports.length > 3 && (
                        <span className="text-[8px] bg-red-500 text-white px-1 rounded">+{zone.reports.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Etiquetas geográficas */}
            <div className="absolute top-[20%] left-[58%] text-xs bg-red-100 px-2 py-1 rounded shadow-sm">
              Volcán Masaya
            </div>
            
            <div className="absolute top-[68%] left-[40%] text-xs bg-blue-100 px-2 py-1 rounded shadow-sm">
              Laguna de Masaya
            </div>

            {/* Instrucciones */}
            {!selectedDisasterType && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/95 px-4 py-2 rounded-lg text-center">
                  <p className="text-sm font-medium">👇 Selecciona un tipo de evento en la barra inferior</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Barra de emojis para reportar */}
      <Card className="sticky bottom-4 z-40 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Reportar Evento:</h3>
            {selectedDisasterType && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedDisasterType(null)}
              >
                Limpiar selección
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {disasterTypes.map((disaster) => (
              <button
                key={disaster.id}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedDisasterType?.id === disaster.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleDisasterSelect(disaster)}
              >
                <span className="text-2xl mb-1">{disaster.emoji}</span>
                <span className="text-xs text-center font-medium">{disaster.name}</span>
              </button>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Selecciona un evento y luego haz clic en una zona del mapa para reportarlo
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Información de zona seleccionada */}
        {selectedZone && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedZone.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedZone(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Zona seleccionada en el mapa de Masaya
              </p>
              
              {selectedZone.reports.length > 0 ? (
                <div>
                  <h4 className="font-medium mb-2">Reportes recientes:</h4>
                  <div className="space-y-2">
                    {selectedZone.reports.map((report) => (
                      <div key={report.id} className="flex items-center gap-2 text-sm">
                        <span>{disasterTypes.find(d => d.id === report.type)?.emoji}</span>
                        <span>{disasterTypes.find(d => d.id === report.type)?.name}</span>
                        <span className="text-muted-foreground ml-auto">
                          {formatTimeAgo(report.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No hay reportes en esta zona aún.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Estadísticas de reportes */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disasterTypes.map((disaster) => {
                const totalReports = zones.reduce((total, zone) => 
                  total + zone.reports.filter(r => r.type === disaster.id).length, 0
                )
                
                return totalReports > 0 ? (
                  <div key={disaster.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{disaster.emoji}</span>
                      <span className="text-sm">{disaster.name}</span>
                    </div>
                    <Badge variant="outline">{totalReports}</Badge>
                  </div>
                ) : null
              })}
              
              {zones.every(zone => zone.reports.length === 0) && (
                <Alert>
                  <AlertDescription>
                    No hay reportes registrados aún.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}